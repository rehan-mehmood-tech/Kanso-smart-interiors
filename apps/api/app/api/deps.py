"""Request dependencies: authentication and role guards.

The seam is defined here now so routers can already declare who may call them.
Real verification -- validating the Supabase JWT and reading `profiles.role` --
lands with the auth/security phase; until then `get_current_user` refuses every
request rather than defaulting to a permissive stub. A route that appears to
work while unauthenticated is the worst possible placeholder.
"""

from __future__ import annotations

from typing import Annotated, Callable

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.errors import ForbiddenError, NotImplementedYetError, UnauthorizedError
from app.schemas.common import CurrentUser
from app.schemas.enums import UserRole

# auto_error=False so a missing header produces our error envelope, not FastAPI's.
_bearer = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
) -> CurrentUser:
    """Resolve the caller from a Supabase access token.

    TODO(auth phase): verify the JWT against the Supabase JWKS, then load
    `profiles.role` for the token's `sub`. Role must come from the database,
    never from a claim the client can shape.
    """
    if credentials is None or not credentials.credentials:
        raise UnauthorizedError("Missing bearer token.")

    raise NotImplementedYetError(
        "Authentication is not wired up yet; it lands with the auth phase.",
    )


CurrentUserDep = Annotated[CurrentUser, Depends(get_current_user)]


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
