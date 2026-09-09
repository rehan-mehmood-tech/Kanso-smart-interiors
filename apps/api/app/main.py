"""Kanso API -- application factory.

Run it:
    cd apps/api
    uvicorn app.main:app --reload --port 8000

Docs at http://localhost:8000/docs, liveness at http://localhost:8000/health.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import API_VERSION
from app.api.v1.router import v1_router
from app.api import health
from app.core.config import get_settings
from app.core.errors import register_exception_handlers
from app.core.logging import RequestContextMiddleware, configure_logging
from app.db.supabase import ping_database

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    configured = settings.configured()
    logger.info(
        "Kanso API %s starting (env=%s, configured: %s)",
        API_VERSION,
        settings.environment,
        ", ".join(f"{k}={'yes' if v else 'no'}" for k, v in configured.items()),
    )
    missing = [name for name, ok in configured.items() if not ok]
    if missing:
        logger.warning(
            "Unconfigured providers: %s. Routes that need them return 503 until "
            "apps/api/.env is filled in.",
            ", ".join(missing),
        )

    # Probe the database once at boot so a broken connection is visible in the
    # terminal immediately, rather than on the first request that needs it.
    probe = await ping_database()
    if probe["connected"] and probe["migrated"]:
        logger.info("Supabase connected: %s", settings.supabase_url)
    elif probe["connected"]:
        logger.warning("Supabase connected but schema not migrated: %s", probe["detail"])
    else:
        logger.error("Supabase NOT connected: %s", probe["detail"])

    yield
    logger.info("Kanso API shutting down")


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings.log_level)

    app = FastAPI(
        title="Kanso API",
        version=API_VERSION,
        summary="Backend for the Kanso AI interior design platform.",
        lifespan=lifespan,
        # Hide interactive docs in production; they describe the whole surface.
        docs_url=None if settings.is_production else "/docs",
        redoc_url=None if settings.is_production else "/redoc",
        openapi_url=None if settings.is_production else "/openapi.json",
    )

    app.add_middleware(RequestContextMiddleware)
    # Browser access rules.
    #
    # allow_credentials=True means the browser will send session cookies, and
    # the spec forbids pairing that with a wildcard origin -- so the allowlist
    # is explicit and preview deployments are matched by an anchored regex.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins(),
        allow_origin_regex=settings.cors_origin_regex,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID"],
    )

    register_exception_handlers(app)

    # /health sits at the root so uptime checks do not depend on the API prefix.
    app.include_router(health.router)
    # The only application surface. Everything here is database-backed; there
    # are no 501 placeholders left to mistake for working endpoints.
    app.include_router(v1_router, prefix=f"{settings.api_v1_prefix}/v1")

    return app


app = create_app()
