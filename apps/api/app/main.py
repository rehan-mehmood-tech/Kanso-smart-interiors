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
from app.api.router import api_router
from app.api.routes import health
from app.core.config import get_settings
from app.core.errors import register_exception_handlers
from app.core.logging import RequestContextMiddleware, configure_logging

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
    app.include_router(api_router, prefix=settings.api_v1_prefix)

    return app


app = create_app()
