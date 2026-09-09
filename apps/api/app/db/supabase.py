"""Supabase client singleton for server-side database access.

The client is built with the **service-role key**, which bypasses row-level
security. That is correct for a trusted backend, and dangerous everywhere
else: never construct this client from a request-supplied value, and never
pass a value that came from a request body into a query without an ownership
check first.

The client is created once and cached. Creation is lazy so that importing this
module never fails on a machine with no credentials, and `/health` can still
answer and say what is missing.
"""

from __future__ import annotations

import logging
from functools import lru_cache
from typing import TYPE_CHECKING, Any

from app.core.config import MissingCredentialError, get_settings

if TYPE_CHECKING:  # pragma: no cover - typing only
    from supabase import Client

logger = logging.getLogger(__name__)


class DatabaseUnavailableError(RuntimeError):
    """Raised when the database cannot be reached or is not configured."""


def _create_client(url: str, key: str) -> "Client":
    try:
        from supabase import create_client
    except ModuleNotFoundError as exc:  # pragma: no cover - depends on install
        raise DatabaseUnavailableError(
            "The 'supabase' package is not installed. Run: pip install -r requirements.txt"
        ) from exc
    return create_client(url, key)


@lru_cache
def get_supabase() -> "Client":
    """The service-role client. Cached for the life of the process.

    Raises MissingCredentialError when the project is not configured, so the
    caller can report exactly which variable is absent rather than failing on
    a malformed URL deep inside the driver.
    """
    settings = get_settings()
    url, service_key = settings.require_supabase()
    logger.debug("Creating Supabase service-role client for %s", url)
    return _create_client(url, service_key)


def reset_supabase() -> None:
    """Drop the cached client. For tests, or after changing configuration."""
    get_supabase.cache_clear()


async def ping_database() -> dict[str, Any]:
    """Actively probe the database and describe what came back.

    Two distinct questions get two distinct probes, because conflating them
    sends people hunting for network faults that do not exist:

      1. Can we reach the project with this credential?  -> `connected`
      2. Does the application schema exist?              -> `migrated`

    A reachable project whose tables have not been created is a real and
    common state (a fresh Supabase project), and it is reported as connected
    but not migrated rather than as a connection failure.
    """
    settings = get_settings()

    try:
        url, service_key = settings.require_supabase()
    except MissingCredentialError as exc:
        return {"connected": False, "migrated": False, "detail": str(exc)}

    # --- 1. Connectivity. The PostgREST root answers for any valid key, and
    # does not depend on a single table existing.
    try:
        import httpx

        response = httpx.get(
            f"{url.rstrip('/')}/rest/v1/",
            headers={"apikey": service_key, "Authorization": f"Bearer {service_key}"},
            timeout=10.0,
        )
        if response.status_code >= 400:
            return {
                "connected": False,
                "migrated": False,
                "detail": f"Supabase responded {response.status_code} to a root request.",
            }
    except Exception as exc:  # noqa: BLE001 - any transport failure is "down"
        logger.warning("Database unreachable: %s", exc)
        return {"connected": False, "migrated": False, "detail": str(exc)}

    # --- 2. Schema. A head request with an exact count touches the table
    # without transferring rows.
    table = settings.health_check_table
    try:
        client = get_supabase()
        client.table(table).select("*", count="exact", head=True).execute()
        return {"connected": True, "migrated": True, "detail": ""}
    except DatabaseUnavailableError as exc:
        return {"connected": True, "migrated": False, "detail": str(exc)}
    except Exception as exc:  # noqa: BLE001
        logger.info("Health-check table '%s' not queryable: %s", table, exc)
        return {
            "connected": True,
            "migrated": False,
            "detail": (
                f"Connected, but the '{table}' table is not available. "
                "Apply the migrations in supabase/migrations/."
            ),
        }
