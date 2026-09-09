"""Pydantic models for `consultation_leads`.

The end of the core loop: a customer picks a design and asks to be contacted.

Contact fields are snapshotted onto the lead rather than joined live, because
the business needs a stable record of what the customer submitted at that
moment, independent of later edits.

`LeadMasked` is what a business may see. The gated fields are resolved by
`business_has_paid_access()` server-side, so an unpaid vendor's response never
contains the values at all.
"""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.schemas.enums import LeadStatus


class ConsultationLeadBase(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    customer_name: str = Field(min_length=1, max_length=200)
    phone: str = Field(min_length=5, max_length=40)
    email: EmailStr | None = None
    #: Coarse location, always shown. `full_address` is the gated one.
    city: str | None = Field(default="Lahore", max_length=120)
    room_type: str | None = Field(default=None, max_length=60)
    style_slug: str | None = Field(default=None, max_length=60)

    @field_validator("phone")
    @classmethod
    def _phone_has_digits(cls, value: str) -> str:
        """A phone number the business cannot dial is worse than none."""
        if sum(ch.isdigit() for ch in value) < 7:
            raise ValueError("Enter a phone number with at least 7 digits.")
        return value.strip()


class ConsultationLeadCreate(ConsultationLeadBase):
    full_address: str | None = None
    #: Links the lead to the design project it came from. Nullable: a lead can
    #: also be captured outside the wizard.
    project_id: UUID | None = None


class ConsultationLead(ConsultationLeadBase):
    """A full lead row, as an admin sees it. Never return this to a business
    without going through the mask."""

    id: UUID
    full_address: str | None = None
    status: LeadStatus = LeadStatus.NEW
    #: Null until assigned. New leads land in the admin queue.
    business_id: UUID | None = None
    project_id: UUID | None = None
    #: Append-only unlock ledger, so a billing dispute has a record.
    unlocked_at: datetime | None = None
    created_at: datetime
    updated_at: datetime | None = None


class LeadMasked(BaseModel):
    """What a business may see. `phone`, `email` and `full_address` are None
    unless `is_unlocked` is true -- enforced in SQL, not here."""

    model_config = ConfigDict(from_attributes=True, extra="ignore")

    id: UUID
    business_id: UUID | None = None
    project_id: UUID | None = None
    customer_name: str
    city: str | None = None
    room_type: str | None = None
    style_slug: str | None = None
    status: LeadStatus = LeadStatus.NEW
    created_at: datetime

    # Gated columns.
    phone: str | None = None
    email: EmailStr | None = None
    full_address: str | None = None

    #: Lets a client tell "you have not paid" apart from "the customer left it
    #: blank", instead of rendering an ambiguous empty field.
    is_unlocked: bool = False


class LeadStatusUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: LeadStatus


class LeadAssignment(BaseModel):
    """Admin override. `None` returns the lead to the unassigned queue."""

    model_config = ConfigDict(extra="forbid")

    business_id: UUID | None = None
