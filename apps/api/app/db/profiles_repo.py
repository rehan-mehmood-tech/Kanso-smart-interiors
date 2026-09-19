"""Persistence for `profiles`.

`profiles.role` is the authorisation source of truth (PRD s19). It is read
here, from the database, on every authenticated request -- never taken from a
JWT claim, because token metadata is client-writable at signup.

Queries run through the service-role client, which bypasses RLS.
"""

from __future__ import annotations

import logging
from typing import Any

from app.db.supabase import get_supabase
from app.schemas.enums import UserRole

logger = logging.getLogger(__name__)

PROFILES = "profiles"


class ProfileNotFoundError(LookupError):
    """No profiles row exists for this authenticated user."""


def get_profile(user_id: str) -> dict[str, Any] | None:
    result = (
        get_supabase()
        .table(PROFILES)
        .select("*")
        .eq("id", user_id)
        .maybe_single()
        .execute()
    )
    if not result or not result.data:
        return None
    return result.data


def ensure_profile(user_id: str, email: str | None, full_name: str | None) -> dict[str, Any]:
    """Return the caller's profile, creating it if the trigger did not.

    The 20260919 migration adds a trigger that mirrors every auth.users row
    into profiles, so this normally finds an existing row and does nothing
    else. The create path is a fallback for a database where that migration has
    not been applied yet -- without it, a valid session would 403 forever with
    no way for the user to fix it.

    The role is hardcoded to `customer` on creation for the same reason the
    trigger hardcodes it: elevating a role is an admin action, never a
    side effect of someone presenting a token.
    """
    profile = get_profile(user_id)
    if profile is not None:
        return profile

    if not email:
        # profiles.email is NOT NULL, so there is nothing to insert.
        raise ProfileNotFoundError(
            f"No profile for user {user_id} and the token carries no email."
        )

    logger.warning(
        "No profiles row for %s; creating one. Apply "
        "supabase/migrations/20260919_profiles_auth_trigger.sql so this is "
        "handled by the database.",
        user_id,
    )
    payload = {
        "id": user_id,
        "email": email,
        "full_name": full_name,
        "role": UserRole.CUSTOMER.value,
    }
    # upsert, not insert: two concurrent first-requests from the same new user
    # would otherwise race and one would fail on the primary key.
    result = get_supabase().table(PROFILES).upsert(payload, on_conflict="id").execute()
    if not result.data:
        raise ProfileNotFoundError(f"Could not create a profile for user {user_id}.")
    return result.data[0]
