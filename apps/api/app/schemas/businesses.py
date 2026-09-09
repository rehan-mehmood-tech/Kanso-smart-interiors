"""Pydantic models for `businesses`.

`is_active` and `is_banned` are separate booleans, matching the schema:
disabling is reversible housekeeping, a ban is a sanction. `bookable` folds
both -- plus verification -- into the single question lead routing asks.
"""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.enums import BusinessKind


class BusinessBase(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    name: str = Field(min_length=1, max_length=200)
    kind: BusinessKind = BusinessKind.SOLO_TRADESMAN
    #: Free text in the database, e.g. carpenter, plumber, furniture_store.
    trade: str | None = Field(default=None, max_length=60)
    phone: str | None = Field(default=None, max_length=40)
    city: str | None = Field(default="Lahore", max_length=120)
    address: str | None = None


class BusinessCreate(BusinessBase):
    #: Nullable: an admin can register a partner before they claim an account.
    owner_id: UUID | None = None


class BusinessUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str | None = Field(default=None, min_length=1, max_length=200)
    kind: BusinessKind | None = None
    trade: str | None = None
    phone: str | None = None
    city: str | None = None
    address: str | None = None
    is_active: bool | None = None


class Business(BusinessBase):
    id: UUID
    owner_id: UUID | None = None
    is_active: bool = True
    is_banned: bool = False
    verified_at: datetime | None = None
    created_at: datetime
    updated_at: datetime | None = None

    @property
    def is_verified(self) -> bool:
        return self.verified_at is not None

    @property
    def bookable(self) -> bool:
        """Whether this business may receive leads. Mirrors the SQL partial
        index `businesses_bookable_idx`."""
        return self.is_active and not self.is_banned and self.is_verified
