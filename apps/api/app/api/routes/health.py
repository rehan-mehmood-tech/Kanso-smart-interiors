"""Liveness and configuration reporting."""

from __future__ import annotations

from fastapi import APIRouter

from app import API_VERSION
from app.core.config import get_settings
from app.schemas.common import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse, summary="Service liveness")
def health_check() -> HealthResponse:
    """Always answers, even with nothing configured.

    `configured` reports which credentials are present so a deploy can be
    checked without shelling into the box. It reports presence only, never
    the values.
    """
    settings = get_settings()
    return HealthResponse(
        version=API_VERSION,
        environment=settings.environment,
        configured=settings.configured(),
    )
