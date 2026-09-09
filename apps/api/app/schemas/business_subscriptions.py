"""Pydantic models for `business_subscriptions` and `customer_disputes`."""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.enums import DisputeStatus, SubscriptionStatus, SubscriptionTier


class BusinessSubscription(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    id: UUID
    business_id: UUID
    tier: SubscriptionTier = SubscriptionTier.FREE_TRIAL
    status: SubscriptionStatus = SubscriptionStatus.TRIALING
    current_period_end: datetime | None = None
    seats_limit: int = Field(default=1, ge=1)
    created_at: datetime
    updated_at: datetime | None = None

    @property
    def grants_paid_access(self) -> bool:
        """Mirrors business_has_paid_access() minus the business join.

        Kept identical on purpose: past_due closes the gate immediately, while
        canceled keeps access until the period already paid for lapses. This
        is a convenience for rendering -- the database predicate is the
        enforcement point.
        """
        if self.tier is SubscriptionTier.FREE_TRIAL:
            return False
        granting = self.status in (
            SubscriptionStatus.TRIALING,
            SubscriptionStatus.ACTIVE,
        ) or (
            self.status is SubscriptionStatus.CANCELED
            and self.current_period_end is not None
        )
        if not granting:
            return False
        if self.current_period_end and self.current_period_end <= datetime.now(timezone.utc):
            return False
        return True


class SubscriptionUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    tier: SubscriptionTier | None = None
    status: SubscriptionStatus | None = None
    current_period_end: datetime | None = None
    seats_limit: int | None = Field(default=None, ge=1)


class CustomerDisputeCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    customer_name: str = Field(min_length=1, max_length=200)
    customer_phone: str | None = Field(default=None, max_length=40)
    business_id: UUID | None = None
    reason: str = Field(min_length=1)


class CustomerDispute(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    id: UUID
    customer_name: str
    customer_phone: str | None = None
    business_id: UUID | None = None
    reason: str
    status: DisputeStatus = DisputeStatus.PENDING
    created_at: datetime
    updated_at: datetime | None = None
