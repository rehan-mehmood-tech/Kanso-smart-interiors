"""Master admin panel: users, businesses, and the unassigned lead queue (PRD s18)."""

from __future__ import annotations

from fastapi import APIRouter

from app.core.errors import NotImplementedYetError
from app.schemas.enums import LeadStatus

router = APIRouter(prefix="/admin", tags=["admin"])

_TODO = "Not built yet -- lands with the admin panel slice."


@router.get("/users", summary="List all users")
async def list_users():
    raise NotImplementedYetError(_TODO)


@router.get("/businesses", summary="List all businesses")
async def list_businesses():
    raise NotImplementedYetError(_TODO)


@router.post("/businesses", summary="Create a business and its owning account")
async def create_business():
    raise NotImplementedYetError(_TODO)


@router.patch("/businesses/{business_id}", summary="Update a business")
async def update_business(business_id: str):
    raise NotImplementedYetError(_TODO)


@router.get("/leads", summary="List every lead, across all businesses")
async def list_all_leads(status: LeadStatus | None = None):
    raise NotImplementedYetError(_TODO)


@router.patch("/leads/{lead_id}/assign", summary="Assign or reassign a lead to a business")
async def assign_lead(lead_id: str, business_id: str):
    raise NotImplementedYetError(_TODO)


@router.patch("/leads/{lead_id}/status", summary="Override a lead's status")
async def override_lead_status(lead_id: str, status: LeadStatus):
    raise NotImplementedYetError(_TODO)
