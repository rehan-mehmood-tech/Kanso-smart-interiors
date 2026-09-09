"""Pydantic models for `businesses` (PRD §15.3 + 20260909_vendor_portal_core.sql).

`kind` and `trade` come from the vendor-portal migration and decide what the
account can do: a solo tradesman gets one seat, a shop gets a crew and a
product catalogue.
"""

from __future__ import annotations

from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class BusinessKind(StrEnum):
    """`business_kind` enum."""

    SOLO_TRADESMAN = "solo_tradesman"
    SHOP_WITH_CREW = "shop_with_crew"


class TradeCategory(StrEnum):
    """`trade_category` enum."""

    FURNITURE_STORE = "furniture_store"
    CARPENTER = "carpenter"
    PLUMBER = "plumber"
    ELECTRICIAN = "electrician"
    PAINTER = "painter"
    JOINER = "joiner"
    LIGHTING = "lighting"
    FLOORING = "flooring"
    OTHER = "other"


class BusinessStatus(StrEnum):
    """`businesses.status`. `banned` is added by the moderation migration and
    is distinct from `disabled`: a ban is a sanction and carries an audit log
    entry, disabling is administrative housekeeping."""

    ACTIVE = "active"
    DISABLED = "disabled"
    BANNED = "banned"


class BusinessBase(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    name: str = Field(min_length=1, max_length=200)
    contact_name: str | None = Field(default=None, max_length=200)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=40)
    location: str | None = Field(default=None, max_length=200)
    kind: BusinessKind = BusinessKind.SOLO_TRADESMAN
    trade: TradeCategory = TradeCategory.OTHER
    #: Cities or neighbourhoods this business will travel to.
    service_areas: list[str] = Field(default_factory=list)


class BusinessCreate(BusinessBase):
    owner_id: UUID


class BusinessUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str | None = Field(default=None, min_length=1, max_length=200)
    contact_name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    location: str | None = None
    kind: BusinessKind | None = None
    trade: TradeCategory | None = None
    service_areas: list[str] | None = None


class Business(BusinessBase):
    id: UUID
    #: `businesses.owner_profile_id` in SQL.
    owner_id: UUID
    status: BusinessStatus = BusinessStatus.ACTIVE
    #: Null until an admin verifies the business. Unverified businesses never
    #: receive leads, regardless of what they have paid.
    verified_at: datetime | None = None
    created_at: datetime
    updated_at: datetime | None = None

    @property
    def is_active(self) -> bool:
        """Convenience for callers that only care whether the account is live."""
        return self.status is BusinessStatus.ACTIVE

    @property
    def is_verified(self) -> bool:
        return self.verified_at is not None
