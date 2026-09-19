"""Supabase access-token verification.

The token arrives as a bearer header from the browser. Verifying it means
checking a real signature against Supabase's published keys -- never merely
decoding it. An unverified decode would accept a token the caller wrote
themselves, which is the same as having no authentication at all.

Two signing schemes are supported because Supabase projects can be on either:

  * **Asymmetric (ES256/RS256)** -- the current default. The project publishes
    its public keys at `/auth/v1/.well-known/jwks.json` and we verify against
    them. The private key never leaves Supabase, so this backend holds no
    secret capable of minting a token.
  * **HS256** -- legacy projects sign with a shared secret. Supported only when
    SUPABASE_JWT_SECRET is configured.

The JWKS is cached in memory and refetched only when a token names a key id we
have not seen, which is what makes key rotation work without a redeploy while
still costing no network call on the common path.
"""

from __future__ import annotations

import logging
import time
from typing import Any

import httpx
import jwt
from jwt import PyJWK, PyJWKSet

from app.core.config import get_settings
from app.core.errors import UnauthorizedError

logger = logging.getLogger(__name__)

#: Supabase sets this audience on user access tokens.
DEFAULT_AUDIENCE = "authenticated"

#: Algorithms we will verify. Listing them explicitly is essential: passing the
#: token's own `alg` back to the verifier is the classic JWT confusion attack
#: (an attacker sets alg=none, or signs an HS256 token using a public key we
#: believe is for RS256 verification).
_ASYMMETRIC_ALGORITHMS = ["ES256", "RS256"]

#: Refuse to refetch the JWKS more than once in this window, so a burst of
#: tokens carrying an unknown kid cannot turn into a burst of outbound
#: requests to Supabase.
_JWKS_MIN_REFETCH_SECONDS = 30.0


class _JwksCache:
    """In-memory JWKS, refreshed on unknown key ids."""

    def __init__(self) -> None:
        self._keys: dict[str, PyJWK] = {}
        self._fetched_at: float = 0.0

    def clear(self) -> None:
        self._keys = {}
        self._fetched_at = 0.0

    async def get(self, kid: str) -> PyJWK:
        key = self._keys.get(kid)
        if key is not None:
            return key

        age = time.monotonic() - self._fetched_at
        if self._keys and age < _JWKS_MIN_REFETCH_SECONDS:
            # Recently refreshed and still unknown: the token is signed by a key
            # this project does not publish.
            raise UnauthorizedError("Token signing key is not recognised.")

        await self._refresh()
        key = self._keys.get(kid)
        if key is None:
            raise UnauthorizedError("Token signing key is not recognised.")
        return key

    async def _refresh(self) -> None:
        settings = get_settings()
        if not settings.supabase_url:
            raise UnauthorizedError("Authentication is not configured.")

        url = f"{settings.supabase_url.rstrip('/')}/auth/v1/.well-known/jwks.json"
        try:
            async with httpx.AsyncClient(timeout=settings.jwks_timeout_seconds) as client:
                response = await client.get(url)
                response.raise_for_status()
                payload = response.json()
        except (httpx.HTTPError, ValueError) as exc:
            logger.error("Could not fetch JWKS from %s: %s", url, exc)
            # A 401 would tell the caller their token is bad, which is not what
            # happened -- our key source is down. Surface it as a real fault.
            raise UnauthorizedError(
                "Could not verify the session right now. Please try again.",
            ) from exc

        try:
            key_set = PyJWKSet.from_dict(payload)
        except Exception as exc:  # pragma: no cover - malformed upstream payload
            logger.error("Malformed JWKS from %s: %s", url, exc)
            raise UnauthorizedError("Could not verify the session right now.") from exc

        self._keys = {key.key_id: key for key in key_set.keys if key.key_id}
        self._fetched_at = time.monotonic()
        logger.info("Loaded %d Supabase signing key(s).", len(self._keys))


_jwks = _JwksCache()


def reset_jwks_cache() -> None:
    """Drop cached signing keys. For tests, or after changing configuration."""
    _jwks.clear()


async def verify_access_token(token: str) -> dict[str, Any]:
    """Verify a Supabase access token and return its claims.

    Raises UnauthorizedError for anything that fails verification, with a
    message safe to show a user: which specific check failed is useful to an
    attacker and useless to a legitimate one, whose real fix is always to log
    in again.
    """
    settings = get_settings()

    try:
        header = jwt.get_unverified_header(token)
    except jwt.PyJWTError as exc:
        raise UnauthorizedError("Invalid session token.") from exc

    algorithm = header.get("alg")

    # Shared options for both schemes. `verify_signature` is implied by using
    # the verifying API, but the rest are spelled out so a future change to
    # PyJWT defaults cannot silently relax them.
    options = {
        "require": ["exp", "sub"],
        "verify_exp": True,
        "verify_aud": True,
        "verify_signature": True,
    }

    try:
        if algorithm == "HS256":
            secret = settings.supabase_jwt_secret
            if not secret:
                # Refuse rather than fall through: accepting an HS256 token we
                # cannot verify would accept any token at all.
                raise UnauthorizedError("Invalid session token.")
            claims = jwt.decode(
                token,
                secret,
                algorithms=["HS256"],
                audience=settings.supabase_jwt_audience,
                leeway=settings.jwt_leeway_seconds,
                options=options,
            )
        elif algorithm in _ASYMMETRIC_ALGORITHMS:
            kid = header.get("kid")
            if not kid:
                raise UnauthorizedError("Invalid session token.")
            signing_key = await _jwks.get(kid)
            claims = jwt.decode(
                token,
                signing_key.key,
                # Only the algorithm this key is actually for.
                algorithms=[algorithm],
                audience=settings.supabase_jwt_audience,
                leeway=settings.jwt_leeway_seconds,
                options=options,
            )
        else:
            # Covers alg=none and anything else unexpected.
            raise UnauthorizedError("Invalid session token.")
    except UnauthorizedError:
        raise
    except jwt.ExpiredSignatureError as exc:
        raise UnauthorizedError("Your session has expired. Please log in again.") from exc
    except jwt.PyJWTError as exc:
        logger.debug("Token rejected: %s", exc)
        raise UnauthorizedError("Invalid session token.") from exc

    subject = claims.get("sub")
    if not subject:
        raise UnauthorizedError("Invalid session token.")

    return claims
