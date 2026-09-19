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
PRODUCTS = "business_products"
INTERACTIONS = "design_interactions"
STYLES = "styles"


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


def list_products_by_ids(product_ids: list[str]) -> list[dict[str, Any]]:
    """Resolve mapped product ids to catalogue rows, with the vendor's name.

    `generated_designs.mapped_products` stores ids only, so a results page
    reloaded later has nothing to render but UUIDs. This is what turns them
    back into "this chair, from this vendor, at this price" without the client
    needing a second round trip per product.

    The embedded businesses join is a PostgREST resource embedding over the
    business_id foreign key, so it stays one request however many ids arrive.
    """
    if not product_ids:
        return []
    result = (
        get_supabase()
        .table(PRODUCTS)
        .select(
            "id,business_id,name,category,price_minor,material,color_hex,"
            "style_tags,businesses(name,city)"
        )
        .in_("id", product_ids)
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
    preferred_mode: str | None = None,
    preferred_time_slot: str | None = None,
    notes: str | None = None,
    selected_design_id: UUID | None = None,
    customer_id: UUID | None = None,
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

    # What the customer asked for in the booking form: how they want to be
    # seen, when, and anything the specialist needs to know before arriving.
    optional = {
        "preferred_mode": preferred_mode,
        "preferred_time_slot": preferred_time_slot,
        "notes": notes,
        # Snapshot of who asked and which concept they chose (PRD s15.10), so
        # the vendor's record does not change if the customer later picks a
        # different concept.
        "selected_design_id": str(selected_design_id) if selected_design_id else None,
        "customer_id": str(customer_id) if customer_id else None,
    }
    payload.update({k: v for k, v in optional.items() if v is not None})

    try:
        result = get_supabase().table(LEADS).insert(payload).execute()
    except Exception as exc:  # noqa: BLE001
        # These columns arrived after the baseline schema. Against a
        # database where the migration has not been applied yet, PostgREST
        # rejects the whole insert for an unknown column -- which would lose a
        # real customer's request over an optional preference. Drop them and
        # keep the lead.
        if not _is_unknown_column(exc, optional):
            raise
        logger.warning(
            "Optional lead columns missing; storing the lead without them. "
            "Apply the 20260910 and 20260919 lead migrations. (%s)",
            exc,
        )
        for key in optional:
            payload.pop(key, None)
        result = get_supabase().table(LEADS).insert(payload).execute()

    return result.data[0]


def _is_unknown_column(exc: Exception, columns: dict[str, Any]) -> bool:
    """Whether this error is PostgREST rejecting one of `columns` as unknown.

    Matched on the column name as well as the schema-cache wording, so an
    unrelated failure is never mistaken for a missing migration and silently
    retried.
    """
    message = str(exc).lower()
    if "pgrst204" not in message and "schema cache" not in message and "column" not in message:
        return False
    return any(name in message for name in columns)


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


# -----------------------------------------------------------------------------
# Project listing (customer dashboard)
# -----------------------------------------------------------------------------


def list_projects_for_customer(customer_id: UUID) -> list[dict[str, Any]]:
    """Every project owned by one customer, newest first.

    Scoped by customer_id in the query itself rather than filtered afterwards:
    this client bypasses RLS, so the WHERE clause is the only thing keeping one
    customer's dashboard from showing another's rooms.
    """
    result = (
        get_supabase()
        .table(PROJECTS)
        .select("*")
        .eq("customer_id", str(customer_id))
        .order("created_at", desc=True)
        .execute()
    )
    return result.data or []


def count_designs_by_project(project_ids: list[str]) -> dict[str, int]:
    """How many concepts exist per project, for the dashboard cards.

    Two hops because `generated_designs` has no project_id of its own: it
    reaches a project only through `design_generations`.
    """
    if not project_ids:
        return {}

    gens = (
        get_supabase()
        .table(GENERATIONS)
        .select("id,project_id")
        .in_("project_id", project_ids)
        .execute()
    ).data or []
    if not gens:
        return {}

    generation_to_project = {str(g["id"]): str(g["project_id"]) for g in gens}
    designs = (
        get_supabase()
        .table(DESIGNS)
        .select("id,generation_id")
        .in_("generation_id", list(generation_to_project))
        .execute()
    ).data or []

    counts: dict[str, int] = {}
    for d in designs:
        pid = generation_to_project.get(str(d["generation_id"]))
        if pid:
            counts[pid] = counts.get(pid, 0) + 1
    return counts


def first_design_for_projects(project_ids: list[str]) -> dict[str, dict[str, Any]]:
    """One representative concept per project, for the card thumbnail."""
    if not project_ids:
        return {}

    gens = (
        get_supabase()
        .table(GENERATIONS)
        .select("id,project_id")
        .in_("project_id", project_ids)
        .execute()
    ).data or []
    if not gens:
        return {}

    generation_to_project = {str(g["id"]): str(g["project_id"]) for g in gens}
    designs = (
        get_supabase()
        .table(DESIGNS)
        .select("*")
        .in_("generation_id", list(generation_to_project))
        .order("overall_score", desc=True)
        .execute()
    ).data or []

    best: dict[str, dict[str, Any]] = {}
    for d in designs:
        pid = generation_to_project.get(str(d["generation_id"]))
        # Ordered by score, so the first one seen for a project is the best one.
        if pid and pid not in best:
            best[pid] = d
    return best


# -----------------------------------------------------------------------------
# Designs, interactions and selection
# -----------------------------------------------------------------------------


def get_design(design_id: UUID) -> dict[str, Any]:
    result = (
        get_supabase()
        .table(DESIGNS)
        .select("*")
        .eq("id", str(design_id))
        .maybe_single()
        .execute()
    )
    if not result or not result.data:
        raise NotFoundError(f"Design {design_id} does not exist.")
    return result.data


def project_id_for_design(design_id: UUID) -> str:
    """Resolve a design back to its project, for the ownership check.

    `generated_designs` stores no project_id, so this hops through
    `design_generations`.
    """
    design = get_design(design_id)
    generation = (
        get_supabase()
        .table(GENERATIONS)
        .select("project_id")
        .eq("id", str(design["generation_id"]))
        .maybe_single()
        .execute()
    )
    if not generation or not generation.data:
        raise NotFoundError(f"Design {design_id} does not exist.")
    return str(generation.data["project_id"])


def get_interaction(
    user_id: UUID, design_id: UUID, interaction_type: str
) -> dict[str, Any] | None:
    result = (
        get_supabase()
        .table(INTERACTIONS)
        .select("*")
        .eq("user_id", str(user_id))
        .eq("design_id", str(design_id))
        .eq("interaction_type", interaction_type)
        .limit(1)
        .execute()
    )
    rows = result.data or []
    return rows[0] if rows else None


def toggle_interaction(
    *, user_id: UUID, design_id: UUID, project_id: str, interaction_type: str
) -> bool:
    """Add or remove a like/save. Returns True when it is now set.

    A toggle rather than an insert, so tapping twice ends where it started
    instead of erroring on the unique index.
    """
    existing = get_interaction(user_id, design_id, interaction_type)
    if existing:
        get_supabase().table(INTERACTIONS).delete().eq("id", existing["id"]).execute()
        return False

    get_supabase().table(INTERACTIONS).insert(
        {
            "user_id": str(user_id),
            "design_id": str(design_id),
            "project_id": project_id,
            "interaction_type": interaction_type,
        }
    ).execute()
    return True


def list_interactions_for_project(user_id: UUID, project_id: UUID) -> list[dict[str, Any]]:
    result = (
        get_supabase()
        .table(INTERACTIONS)
        .select("*")
        .eq("user_id", str(user_id))
        .eq("project_id", str(project_id))
        .execute()
    )
    return result.data or []


def set_selected_design(project_id: UUID, design_id: UUID) -> dict[str, Any]:
    """Point the project at the chosen concept.

    One selection per project: this overwrites whatever was there, which is
    exactly the "selecting a new design clears the previous one" rule from PRD
    s31 -- enforced by the column holding a single value, not by cleanup logic.
    """
    result = (
        get_supabase()
        .table(PROJECTS)
        .update(
            {
                "selected_design_id": str(design_id),
                "status": ProjectStatus.DESIGN_SELECTED.value,
            }
        )
        .eq("id", str(project_id))
        .execute()
    )
    if not result.data:
        raise NotFoundError(f"Project {project_id} does not exist.")
    return result.data[0]


def record_selection_event(*, user_id: UUID, design_id: UUID, project_id: UUID) -> None:
    """Append a `select` row for event history (PRD s31).

    Analytics only. It is never read back to decide what is selected, so a
    failure here must not fail the user's action.
    """
    try:
        get_supabase().table(INTERACTIONS).insert(
            {
                "user_id": str(user_id),
                "design_id": str(design_id),
                "project_id": str(project_id),
                "interaction_type": "select",
            }
        ).execute()
    except Exception:  # noqa: BLE001 - history is best-effort
        logger.warning("Could not record select event for design %s", design_id, exc_info=True)


def list_photos_for_projects(project_ids: list[str]) -> dict[str, list[dict[str, Any]]]:
    """Photos for many projects in one query, grouped by project.

    The dashboard needs each card's wall progress; fetching them per project
    would be one round trip per row.
    """
    if not project_ids:
        return {}
    rows = (
        get_supabase()
        .table(PHOTOS)
        .select("*")
        .in_("project_id", project_ids)
        .execute()
    ).data or []

    grouped: dict[str, list[dict[str, Any]]] = {}
    for row in rows:
        grouped.setdefault(str(row["project_id"]), []).append(row)
    return grouped
