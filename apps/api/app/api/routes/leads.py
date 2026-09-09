"""Consultation leads -- the end of the core loop (PRD s18)."""

from __future__ import annotations

from fastapi import APIRouter

from app.core.errors import NotImplementedYetError

router = APIRouter(tags=["leads"])

_TODO = "Not built yet -- lands with the leads slice."


@router.post("/leads", summary="Submit a consultation request")
async def create_lead():
    """Idempotent per project: a second submit returns the existing lead.

    Requires the project to have `selected_design_id` set and to belong to the
    caller. New leads default to unassigned and land in the admin queue --
    there is no matching algorithm in V1.
    """
    raise NotImplementedYetError(_TODO)
