"""Supabase client wiring.

Two distinct clients, deliberately kept apart:

* `get_service_client()` uses the **service-role** key. It bypasses RLS, so it
  is only for trusted server work -- signing storage URLs, writing generation
  results, admin queries. It must never be handed a value that came from a
  request body without an ownership check first.
* `get_user_client(access_token)` acts **as the calling user**, so Postgres RLS
  is what actually enforces ownership. Prefer this for anything reading or
  writing a customer's own rows.

Both are lazy: no Supabase project exists yet, and importing this module must
not fail because of that. The client library is also an optional import, so the
API still boots (and /health still answers) before `pip install` has run.
"""

from __future__ import annotations

import logging
from functools import lru_cache
from typing import TYPE_CHECKING, Any

from app.core.config import MissingCredentialError, get_settings

if TYPE_CHECKING:  # pragma: no cover - typing only
    from supabase import Client

logger = logging.getLogger(__name__)


def _load_create_client() -> Any:
    try:
        from supabase import create_client
    except ModuleNotFoundError as exc:  # pragma: no cover - depends on install state
        raise MissingCredentialError(
            "the 'supabase' package (pip install -r requirements.txt)"
        ) from exc
    return create_client


@lru_cache
def get_service_client() -> "Client":
    """Service-role client. Bypasses RLS -- use only for trusted server work."""
    settings = get_settings()
    url, service_key = settings.require_supabase()
    logger.debug("Creating Supabase service-role client")
    return _load_create_client()(url, service_key)


def get_user_client(access_token: str) -> "Client":
    """Client scoped to one user's JWT, so RLS policies apply to every query."""
    settings = get_settings()
    if not settings.supabase_url:
        raise MissingCredentialError("SUPABASE_URL")
    if not settings.supabase_anon_key:
        raise MissingCredentialError("SUPABASE_ANON_KEY")

    client = _load_create_client()(settings.supabase_url, settings.supabase_anon_key)
    client.postgrest.auth(access_token)
    return client


def reset_clients() -> None:
    """Drop cached clients (tests, or after changing configuration)."""
    get_service_client.cache_clear()
