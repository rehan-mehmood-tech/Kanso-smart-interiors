"""Application settings, loaded from the environment (and .env in development).

Every external credential is optional so the API boots on a fresh clone with no
secrets present. Anything that actually needs a credential asks for it through
the `require_*` helpers, which fail loudly at call time rather than at import
time -- that keeps `/health` and the OpenAPI docs usable before Supabase or the
AI providers are configured.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Annotated, Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class MissingCredentialError(RuntimeError):
    """Raised when a code path needs a credential that has not been configured."""

    def __init__(self, name: str) -> None:
        super().__init__(
            f"{name} is not set. Copy apps/api/.env.example to apps/api/.env and fill it in."
        )
        self.name = name


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # --- Service ---
    environment: Literal["development", "staging", "production"] = "development"
    debug: bool = True
    api_v1_prefix: str = "/api"
    log_level: str = "INFO"

    # --- CORS: the Next.js origins allowed to call this API ---
    #
    # NoDecode stops pydantic-settings from JSON-decoding this before the
    # validator runs. Without it a plain comma-separated value -- which is what
    # a Render dashboard variable holds -- raises a JSONDecodeError at import
    # time and the service never boots.
    cors_origins: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: ["http://localhost:3000", "http://127.0.0.1:3000"]
    )
    #: The production Vercel domain, injected by the deployment environment.
    next_public_site_url: str | None = None
    #: Vercel generates a new hostname per preview deployment, so previews are
    #: matched by pattern rather than listed. Anchored at both ends so that
    #: something like "evil-vercel.app.attacker.com" cannot match.
    cors_origin_regex: str = r"^https://[a-z0-9-]+\.vercel\.app$"

    # --- Supabase (Postgres + Auth + Storage) ---
    supabase_url: str | None = None
    supabase_anon_key: str | None = None
    supabase_service_role_key: str | None = None

    #: Table probed by GET /health. Any always-present table works; profiles is
    #: the first one the baseline migration creates.
    health_check_table: str = "profiles"

    # Private buckets, signed-URL access only (PRD s16).
    room_photos_bucket: str = "room-photos"
    generated_designs_bucket: str = "generated-designs"

    # --- AI providers ---
    # Gemini reads the four wall photos into a structured spatial brief.
    gemini_api_key: str | None = None
    #: 1.5 and 2.5 are retired for new keys; 3.6-flash is the current vision
    #: model this project's key can reach.
    gemini_vision_model: str = "gemini-3.6-flash"

    #: Which engine renders the concepts. See services/image_generator.py.
    image_generator_provider: str = "pollinations"
    huggingface_api_token: str | None = None
    huggingface_image_model: str = "black-forest-labs/FLUX.1-schnell"

    replicate_api_token: str | None = None
    flux_model: str = "black-forest-labs/flux-1.1-pro"

    # --- Generation limits (PRD s18: 4-6 concepts, target 5) ---
    designs_per_generation: int = 5
    generation_timeout_seconds: int = 180

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_origins(cls, value: object) -> object:
        """Accept CORS_ORIGINS as JSON or as a plain comma-separated string.

        Render and Vercel dashboards store variables as plain strings, so the
        comma-separated form is the one that actually turns up in production.
        """
        if isinstance(value, str):
            text = value.strip()
            if text.startswith("["):
                import json

                return json.loads(text)
            return [origin.strip() for origin in text.split(",") if origin.strip()]
        return value

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    def allowed_origins(self) -> list[str]:
        """Explicit origin allowlist: the configured origins plus the
        production site URL, de-duplicated and order-preserved."""
        origins = list(self.cors_origins)
        if self.next_public_site_url:
            site = self.next_public_site_url.rstrip("/")
            if site not in origins:
                origins.append(site)
        return origins

    def require_supabase(self) -> tuple[str, str]:
        """Return (url, service_role_key) or explain what is missing."""
        if not self.supabase_url:
            raise MissingCredentialError("SUPABASE_URL")
        if not self.supabase_service_role_key:
            raise MissingCredentialError("SUPABASE_SERVICE_ROLE_KEY")
        return self.supabase_url, self.supabase_service_role_key

    def require_gemini(self) -> str:
        if not self.gemini_api_key:
            raise MissingCredentialError("GEMINI_API_KEY")
        return self.gemini_api_key

    def require_replicate(self) -> str:
        if not self.replicate_api_token:
            raise MissingCredentialError("REPLICATE_API_TOKEN")
        return self.replicate_api_token

    def configured(self) -> dict[str, bool]:
        """Credential presence, for /health. Never exposes the values themselves."""
        return {
            "supabase": bool(self.supabase_url and self.supabase_service_role_key),
            "gemini": bool(self.gemini_api_key),
            "image_generator": True,  # pollinations needs no credential
            "huggingface": bool(self.huggingface_api_token),
            "replicate": bool(self.replicate_api_token),
        }


@lru_cache
def get_settings() -> Settings:
    """Cached so the env is read once per process."""
    return Settings()
