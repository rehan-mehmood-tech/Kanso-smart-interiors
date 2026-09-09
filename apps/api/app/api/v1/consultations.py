"""Consultation leads and specialist auto-assignment.

Mounted at /api/v1/consultations. This is the end of the customer loop: a
design becomes a request that reaches a real vendor.
"""

from __future__ import annotations

import logging
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, status
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.core.errors import NotFoundError
from app.db import projects_repo as repo

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/consultations", tags=["consultations"])


class ConsultationRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    customer_name: str = Field(min_length=1, max_length=200)
    phone: str = Field(min_length=5, max_length=40)
    email: EmailStr | None = None
    city: str | None = Field(default="Lahore", max_length=120)
    full_address: str | None = None
    #: Optional link to the design project this request came from.
    project_id: UUID | None = None

    @field_validator("phone")
    @classmethod
    def _phone_has_digits(cls, value: str) -> str:
        """A number the vendor cannot dial is worse than no lead at all."""
        if sum(ch.isdigit() for ch in value) < 7:
            raise ValueError("Enter a phone number with at least 7 digits.")
        return value.strip()


class AssignedBusiness(BaseModel):
    id: UUID
    name: str
    trade: str | None = None
    city: str | None = None


class ConsultationResponse(BaseModel):
    lead_id: UUID
    status: str
    #: `assigned` when a vendor was matched, `queued` when it went to the
    #: admin queue instead.
    assignment: Literal["assigned", "queued"]
    business: AssignedBusiness | None = None
    #: True when this request matched a lead that already existed for the
    #: project, rather than creating a second one.
    deduplicated: bool = False
    message: str


@router.post("", status_code=status.HTTP_201_CREATED, summary="Submit a consultation request")
async def create_consultation(payload: ConsultationRequest) -> ConsultationResponse:
    """Create a lead and try to route it to a vendor.

    Auto-assignment considers only bookable vendors -- active, not banned, and
    verified -- in the customer's city, and prefers one with paid access.
    An unpaid vendor cannot see contact details, so assigning to them would
    strand the customer with a lead nobody can act on. With no match the lead
    is queued for an admin rather than dropped.

    Submitting twice for the same project returns the existing lead instead of
    creating a second one, so a double-tap does not bill a vendor twice for
    one customer.
    """
    room_type: str | None = None
    style_slug: str | None = None

    if payload.project_id is not None:
        try:
            project = repo.get_project(payload.project_id)
        except repo.NotFoundError as exc:
            raise NotFoundError(str(exc)) from exc

        room_type = project.get("room_type")
        style_slug = project.get("style_slug")

        existing = repo.find_lead_for_project(payload.project_id)
        if existing:
            business = None
            if existing.get("business_id"):
                match = repo.find_matching_business(existing.get("city"))
                if match and match["id"] == existing["business_id"]:
                    business = AssignedBusiness(**match)
            return ConsultationResponse(
                lead_id=existing["id"],
                status=existing["status"],
                assignment="assigned" if existing.get("business_id") else "queued",
                business=business,
                deduplicated=True,
                message="A consultation request already exists for this project.",
            )

    match = repo.find_matching_business(payload.city)

    lead = repo.create_lead(
        customer_name=payload.customer_name,
        phone=payload.phone,
        email=payload.email,
        city=payload.city,
        full_address=payload.full_address,
        room_type=room_type,
        style_slug=style_slug,
        project_id=payload.project_id,
        business_id=match["id"] if match else None,
    )

    if match:
        logger.info("Lead %s auto-assigned to %s", lead["id"], match["name"])
        return ConsultationResponse(
            lead_id=lead["id"],
            status=lead["status"],
            assignment="assigned",
            business=AssignedBusiness(**match),
            message=f"Matched with {match['name']}. They will be in touch.",
        )

    logger.info("Lead %s queued: no bookable vendor in %s", lead["id"], payload.city)
    return ConsultationResponse(
        lead_id=lead["id"],
        status=lead["status"],
        assignment="queued",
        message="No verified specialist is available in your area yet. Our team will match you manually.",
    )


@router.get("/{lead_id}", summary="Lead status")
async def get_consultation(lead_id: UUID) -> ConsultationResponse:
    from app.db.supabase import get_supabase

    result = (
        get_supabase()
        .table("consultation_leads")
        .select("*")
        .eq("id", str(lead_id))
        .maybe_single()
        .execute()
    )
    if not result or not result.data:
        raise NotFoundError(f"Lead {lead_id} does not exist.")

    lead = result.data
    business = None
    if lead.get("business_id"):
        biz = (
            get_supabase()
            .table("businesses")
            .select("id,name,trade,city")
            .eq("id", lead["business_id"])
            .maybe_single()
            .execute()
        )
        if biz and biz.data:
            business = AssignedBusiness(**biz.data)

    return ConsultationResponse(
        lead_id=lead["id"],
        status=lead["status"],
        assignment="assigned" if lead.get("business_id") else "queued",
        business=business,
        message="Assigned to a specialist." if business else "Waiting on manual assignment.",
    )
