"""Persistence for the customer design pipeline.

Every query here runs through the service-role client, which bypasses RLS.
That is correct for a trusted backend, and it means ownership must be checked
in code before acting on anything a request supplied.

Table and column names match 20260909_master_baseline_schema.sql exactly.
"""

from __future__ import annotations

import logging
from typing import Any
from uuid import UUID

from app.db.supabase import get_supabase
from app.schemas.enums import ALL_WALL_ANGLES, ProjectStatus, WallAngle

logger = logging.getLogger(__name__)

PROJECTS = "room_projects"
PHOTOS = "room_photos"
GENERATIONS = "design_generations"
DESIGNS = "generated_designs"
LEADS = "consultation_leads"
BUSINESSES = "businesses"


class NotFoundError(LookupError):
    """The requested row does not exist."""


# -----------------------------------------------------------------------------
# room_projects
# -----------------------------------------------------------------------------


def create_project(
    *,
    city: str | None,
    room_type: str | None,
    style_slug: str | None,
    budget_pkr: int | None,
    customer_id: UUID | None = None,
) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "city": city,
        "room_type": room_type,
        "style_slug": style_slug,
        "budget_pkr": budget_pkr,
        "status": ProjectStatus.DRAFT.value,
    }
    if customer_id is not None:
        payload["customer_id"] = str(customer_id)

    result = get_supabase().table(PROJECTS).insert(payload).execute()
    return result.data[0]


def get_project(project_id: UUID) -> dict[str, Any]:
    result = (
        get_supabase()
        .table(PROJECTS)
        .select("*")
        .eq("id", str(project_id))
        .maybe_single()
        .execute()
    )
    if not result or not result.data:
        raise NotFoundError(f"Project {project_id} does not exist.")
    return result.data


def set_project_status(project_id: UUID, status: ProjectStatus) -> dict[str, Any]:
    result = (
        get_supabase()
        .table(PROJECTS)
        .update({"status": status.value})
        .eq("id", str(project_id))
        .execute()
    )
    if not result.data:
        raise NotFoundError(f"Project {project_id} does not exist.")
    return result.data[0]


# -----------------------------------------------------------------------------
# room_photos
# -----------------------------------------------------------------------------


def upsert_photo(
    *,
    project_id: UUID,
    wall_angle: WallAngle,
    image_url: str,
    metadata: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Insert or replace one wall capture.

    The table has UNIQUE (project_id, wall_angle), so re-uploading a wall must
    replace it rather than add a fifth photo. Upserting on that constraint is
    what makes the capture step idempotent -- a retry after a flaky mobile
    upload cannot corrupt the four-wall set.
    """
    payload = {
        "project_id": str(project_id),
        "wall_angle": wall_angle.value,
        "image_url": image_url,
        "metadata": metadata or {},
    }
    result = (
        get_supabase()
        .table(PHOTOS)
        .upsert(payload, on_conflict="project_id,wall_angle")
        .execute()
    )
    return result.data[0]


def list_photos(project_id: UUID) -> list[dict[str, Any]]:
    result = (
        get_supabase()
        .table(PHOTOS)
        .select("*")
        .eq("project_id", str(project_id))
        .order("created_at")
        .execute()
    )
    return result.data or []


def wall_progress(photos: list[dict[str, Any]]) -> tuple[bool, list[str]]:
    """(complete, missing_angles) for a set of photo rows."""
    have = {p["wall_angle"] for p in photos}
    missing = [a.value for a in ALL_WALL_ANGLES if a.value not in have]
    return (not missing, missing)


# -----------------------------------------------------------------------------
# generations and designs
# -----------------------------------------------------------------------------


def list_generations(project_id: UUID) -> list[dict[str, Any]]:
    result = (
        get_supabase()
        .table(GENERATIONS)
        .select("*")
        .eq("project_id", str(project_id))
        .order("created_at", desc=True)
        .execute()
    )
    return result.data or []


def list_designs_for_generations(generation_ids: list[str]) -> list[dict[str, Any]]:
    if not generation_ids:
        return []
    result = (
        get_supabase()
        .table(DESIGNS)
        .select("*")
        .in_("generation_id", generation_ids)
        .order("overall_score", desc=True)
        .execute()
    )
    return result.data or []


# -----------------------------------------------------------------------------
# consultation_leads and matching
# -----------------------------------------------------------------------------

#: Trades that can take on a whole-room interior job. A plumber is a real
#: partner but is not who an unqualified "design my living room" lead should
#: land on, so the auto-match only considers these.
INTERIOR_TRADES: tuple[str, ...] = (
    "furniture_store",
    "carpenter",
    "joiner",
    "lighting",
    "flooring",
    "painter",
)


def find_matching_business(city: str | None, trades: tuple[str, ...] = INTERIOR_TRADES) -> dict[str, Any] | None:
    """Pick a vendor for a new lead, or None to leave it in the admin queue.

    Only bookable vendors are considered: active, not banned, and verified.
    An unverified business never receives a lead regardless of what it paid.

    Among those, a paying vendor wins over a trialing one -- an unpaid vendor
    cannot see the contact details anyway, so assigning to them would strand
    the customer. Ties break on the longest-verified vendor, which is stable
    and explainable rather than random.
    """
    if not city:
        return None

    query = (
        get_supabase()
        .table(BUSINESSES)
        .select("id,name,city,trade,verified_at")
        .eq("city", city)
        .eq("is_active", True)
        .eq("is_banned", False)
        .not_.is_("verified_at", "null")
        .in_("trade", list(trades))
        .order("verified_at")
    )
    candidates = query.execute().data or []
    if not candidates:
        return None

    client = get_supabase()
    paid: list[dict[str, Any]] = []
    for business in candidates:
        try:
            allowed = client.rpc(
                "business_has_paid_access", {"b_id": business["id"]}
            ).execute()
            if allowed.data is True:
                paid.append(business)
        except Exception as exc:  # noqa: BLE001 - a failed check is not a match
            logger.warning("Paid-access check failed for %s: %s", business["id"], exc)

    return (paid or candidates)[0]


def create_lead(
    *,
    customer_name: str,
    phone: str,
    email: str | None,
    city: str | None,
    full_address: str | None,
    room_type: str | None,
    style_slug: str | None,
    project_id: UUID | None,
    business_id: str | None,
) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "customer_name": customer_name,
        "phone": phone,
        "email": email,
        "city": city,
        "full_address": full_address,
        "room_type": room_type,
        "style_slug": style_slug,
        "status": "new",
        "business_id": business_id,
        "project_id": str(project_id) if project_id else None,
    }
    result = get_supabase().table(LEADS).insert(payload).execute()
    return result.data[0]


def find_lead_for_project(project_id: UUID) -> dict[str, Any] | None:
    """Existing lead for a project, if any.

    Submitting a consultation twice for the same project must not create two
    leads -- the vendor would be billed for one customer twice.
    """
    result = (
        get_supabase()
        .table(LEADS)
        .select("*")
        .eq("project_id", str(project_id))
        .limit(1)
        .execute()
    )
    rows = result.data or []
    return rows[0] if rows else None
