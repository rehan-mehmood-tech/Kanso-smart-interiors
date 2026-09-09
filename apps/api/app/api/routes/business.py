"""Business portal: a vendor's own assigned leads (PRD s18).

Every route here is scoped to the caller's `business_id`. A business may reach
a customer's room photos and selected design *only* through the lead detail
route, and only for leads assigned to them (PRD s17).
"""

from __future__ import annotations

from fastapi import APIRouter

from app.core.errors import NotImplementedYetError
from app.schemas.enums import LeadStatus

router = APIRouter(prefix="/business", tags=["business"])

_TODO = "Not built yet -- lands with the vendor portal slice."


@router.get("/leads", summary="List leads assigned to this business")
async def list_business_leads(status: LeadStatus | None = None):
    raise NotImplementedYetError(_TODO)


@router.get("/leads/{lead_id}", summary="Lead detail with project, photos and selected design")
async def get_business_lead(lead_id: str):
    raise NotImplementedYetError(_TODO)


@router.patch("/leads/{lead_id}/status", summary="Move a lead through new/contacted/completed")
async def update_business_lead_status(lead_id: str, status: LeadStatus):
    raise NotImplementedYetError(_TODO)
