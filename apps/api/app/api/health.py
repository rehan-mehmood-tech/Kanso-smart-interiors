"""Liveness, configuration reporting, and a live database probe."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Response, status

from app import API_VERSION
from app.core.config import get_settings
from app.db.supabase import ping_database
from app.schemas.common import HealthResponse

router = APIRouter(tags=["health"])


def _utc_now() -> str:
    """RFC 3339 UTC, e.g. 2026-09-09T00:00:00Z."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


@router.get("/health", response_model=HealthResponse, summary="Service and database health")
async def health_check(response: Response) -> HealthResponse:
    """Answers even with nothing configured, and actively pings the database.

    Returns 503 when the database is unreachable so an uptime check and
    Render's health probe both fail loudly rather than reporting a green
    service in front of a dead database.
    """
    settings = get_settings()
    probe = await ping_database()

    if not probe["connected"]:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        db_state = "disconnected"
        health_state = "unhealthy"
    elif not probe["migrated"]:
        # Reachable, but the application schema is not there. Still degraded:
        # every endpoint that touches a table would fail.
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        db_state = "connected"
        health_state = "degraded"
    else:
        db_state = "connected"
        health_state = "healthy"

    return HealthResponse(
        status=health_state,
        database=db_state,
        timestamp=_utc_now(),
        version=API_VERSION,
        environment=settings.environment,
        configured=settings.configured(),
        detail=probe["detail"] or None,
    )
