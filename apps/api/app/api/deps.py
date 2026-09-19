"""Request dependencies: authentication and role guards.

A route that declares `CurrentUserDep` is authenticated: the bearer token is
verified against Supabase's published signing keys (app.core.auth) and the
caller's role is then read from the `profiles` table. Role never comes from a
token claim -- signup metadata is client-writable, so trusting it would let
anyone mint an admin.

`OptionalUserDep` exists for routes that must serve both a signed-in customer
and an anonymous visitor. It returns None instead of raising when no
credentials are present, but a token that *is* present must still be valid --
a bad token is an error, never silently treated as anonymous.
"""

from __future__ import annotations

import logging
from typing import Annotated, Callable
from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.auth import verify_access_token
from app.core.errors import ForbiddenError, NotFoundError, UnauthorizedError
from app.db import profiles_repo
from app.db.supabase import DatabaseUnavailableError
from app.schemas.common import CurrentUser
from app.schemas.enums import UserRole

logger = logging.getLogger(__name__)

# auto_error=False so a missing header produces our error envelope, not FastAPI's.
_bearer = HTTPBearer(auto_error=False)

BearerDep = Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)]


async def _resolve(credentials: HTTPAuthorizationCredentials) -> CurrentUser:
    token = credentials.credentials
    claims = await verify_access_token(token)

    user_id = str(claims["sub"])
    email = claims.get("email")
    # Supabase nests signup metadata here; used only for a display name.
    metadata = claims.get("user_metadata") or {}
    full_name = metadata.get("full_name") or metadata.get("name")

    try:
        profile = profiles_repo.ensure_profile(user_id, email, full_name)
    except profiles_repo.ProfileNotFoundError as exc:
        logger.warning("Authenticated user %s has no usable profile: %s", user_id, exc)
        raise UnauthorizedError("Your account is not set up. Please sign up again.") from exc
    except DatabaseUnavailableError:
        # Let the configured handler turn this into a 503; a 401 would tell the
        # user to log in again for a problem that is entirely ours.
        raise

    try:
        role = UserRole(profile["role"])
    except (KeyError, ValueError):
        logger.error("Profile %s has an unrecognised role: %r", user_id, profile.get("role"))
        raise ForbiddenError("Your account role is not recognised.") from None

    return CurrentUser(
        id=user_id,
        email=profile.get("email") or email,
        role=role,
        access_token=token,
    )


async def get_current_user(credentials: BearerDep) -> CurrentUser:
    """Resolve the caller from a Supabase access token."""
    if credentials is None or not credentials.credentials:
        raise UnauthorizedError("Missing bearer token.")
    return await _resolve(credentials)


async def get_optional_user(credentials: BearerDep) -> CurrentUser | None:
    """Resolve the caller, or None when the request carries no credentials."""
    if credentials is None or not credentials.credentials:
        return None
    return await _resolve(credentials)


CurrentUserDep = Annotated[CurrentUser, Depends(get_current_user)]
OptionalUserDep = Annotated[CurrentUser | None, Depends(get_optional_user)]


def require_role(*roles: UserRole) -> Callable[[CurrentUser], CurrentUser]:
    """Dependency factory restricting a route to the given roles."""

    async def _guard(user: CurrentUserDep) -> CurrentUser:
        if user.role not in roles:
            allowed = ", ".join(sorted(role.value for role in roles))
            raise ForbiddenError(f"This endpoint requires role: {allowed}.")
        return user

    return _guard


require_customer = require_role(UserRole.CUSTOMER)
require_business = require_role(UserRole.BUSINESS)
require_admin = require_role(UserRole.ADMIN)

CustomerDep = Annotated[CurrentUser, Depends(require_customer)]
BusinessDep = Annotated[CurrentUser, Depends(require_business)]
AdminDep = Annotated[CurrentUser, Depends(require_admin)]


def assert_owns_project(user: CurrentUser, project: dict) -> None:
    """Guard a project against access by anyone but its owner (or an admin).

    Raises NotFoundError, not ForbiddenError: telling a stranger "this exists
    but is not yours" confirms the id is real. PRD s19 prefers 404 for
    existence-hiding on customer resources.

    A project with no `customer_id` predates authentication. It is treated as
    inaccessible rather than public -- the safe reading of missing ownership.
    """
    if user.is_admin:
        return

    owner_id = project.get("customer_id")
    if owner_id is None or str(owner_id) != str(user.id):
        raise NotFoundError(f"Project {project.get('id')} does not exist.")


def owned_project_or_404(user: CurrentUser, project_id: UUID, project: dict) -> dict:
    """Convenience wrapper: check ownership and hand the row back."""
    assert_owns_project(user, project)
    return project
