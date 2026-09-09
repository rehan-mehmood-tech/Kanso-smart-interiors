"""Pydantic models for `consultation_leads` (PRD §15.10).

The end of the core loop: a customer picks a design and asks to be contacted.

Contact fields are snapshotted onto the lead rather than joined from
`profiles`, because the business needs a stable record of what the customer
submitted at that moment, independent of later profile edits (PRD §15.10).

`LeadMasked` mirrors the `leads_masked` view: for a business without an active
paid subscription, the contact columns come back as NULL from Postgres, so the
values never reach the response at all.
"""

from __future__ import annotations

from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class LeadStatus(StrEnum):
    """The whole vocabulary (PRD §15.10). There are no other statuses."""

    NEW = "new"
    CONTACTED = "contacted"
    COMPLETED = "completed"


class ConsultationLeadBase(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    customer_name: str = Field(min_length=1, max_length=200)
    phone: str = Field(min_length=5, max_length=40)
    email: EmailStr | None = None
    #: Coarse location, always shown. The precise address lives in `location`
    #: and is gated behind the paywall.
    city: str | None = Field(default=None, max_length=200)
    room_type: str | None = Field(default=None, max_length=60)
    style_slug: str | None = Field(default=None, max_length=60)
    message: str | None = None

    @field_validator("phone")
    @classmethod
    def _phone_has_digits(cls, value: str) -> str:
        """A phone number the business cannot dial is worse than none."""
        if sum(ch.isdigit() for ch in value) < 7:
            raise ValueError("Enter a phone number with at least 7 digits.")
        return value.strip()


class ConsultationLeadCreate(ConsultationLeadBase):
    project_id: UUID
    customer_id: UUID
    selected_design_id: UUID
    preferred_contact_time: str | None = Field(default=None, max_length=120)
    #: Full street address. Withheld from unpaid businesses by `leads_masked`.
    location: str | None = None


class ConsultationLead(ConsultationLeadBase):
    """A full lead row, as an admin sees it. Never return this to a business
    without going through the mask."""

    id: UUID
    project_id: UUID
    customer_id: UUID
    selected_design_id: UUID
    #: Null until assigned. New leads land in the admin queue (PRD §25.1).
    business_id: UUID | None = None
    location: str | None = None
    preferred_contact_time: str | None = None
    status: LeadStatus = LeadStatus.NEW
    #: Append-only unlock ledger, so a billing dispute has a record.
    unlocked_by_business_id: UUID | None = None
    unlocked_at: datetime | None = None
    created_at: datetime
    updated_at: datetime | None = None


class LeadMasked(BaseModel):
    """One row of the `leads_masked` view -- what a business may see.

    `phone`, `email` and `full_address` are None unless `is_unlocked` is true.
    That is enforced in SQL, not here: this model only describes the shape.
    """

    model_config = ConfigDict(from_attributes=True, extra="ignore")

    id: UUID
    business_id: UUID | None = None
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
    message: str | None = None

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
