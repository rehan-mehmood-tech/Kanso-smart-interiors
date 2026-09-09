"""Shared response envelopes and the authenticated-principal model."""

from __future__ import annotations

from typing import Any, Generic, TypeVar

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.enums import UserRole

T = TypeVar("T")


class ErrorBody(BaseModel):
    code: str
    message: str
    details: dict[str, Any] | None = None


class ErrorResponse(BaseModel):
    """The shape every failure returns; see app.core.errors."""

    error: ErrorBody


class Envelope(BaseModel, Generic[T]):
    """Wraps a single payload, so responses stay extensible without breaking clients."""

    data: T


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "kanso-api"
    version: str
    environment: str
    #: Which external credentials are present. Values are never included.
    configured: dict[str, bool] = Field(default_factory=dict)


class CurrentUser(BaseModel):
    """The authenticated caller.

    `role` is always read from the `profiles` table server-side and never taken
    from the request, per PRD s19.
    """

    model_config = ConfigDict(frozen=True)

    id: str
    email: str | None = None
    role: UserRole
    access_token: str

    @property
    def is_admin(self) -> bool:
        return self.role is UserRole.ADMIN

    @property
    def is_business(self) -> bool:
        return self.role is UserRole.BUSINESS
