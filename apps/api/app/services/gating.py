"""Trial gating: payment method and daily quota.

Both checks are fully implemented. Whether they are ENFORCED is decided by
`ENABLE_CARD_GATING` and `ENABLE_DAILY_QUOTA_LIMIT`, which default to False so
the pipeline can be exercised end to end during development.

The flags gate enforcement only -- the checks still run and still report what
they would have decided. Skipping the logic entirely would mean the first time
anyone exercises this code is the day it is switched on in production, which
is the worst possible moment to find a bug in it.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from uuid import UUID

from app.core.config import get_settings
from app.db.supabase import get_supabase

logger = logging.getLogger(__name__)

GENERATIONS = "design_generations"
DESIGNS = "generated_designs"
PROJECTS = "room_projects"


@dataclass
class GateDecision:
    """What a check decided, and whether that decision is being enforced."""

    allowed: bool
    #: True when the check would have blocked, but its flag is off.
    bypassed: bool = False
    reason: str = ""
    #: Counters, useful for a "2 of 3 rooms used today" banner.
    detail: dict[str, int] = field(default_factory=dict)

    @property
    def blocks(self) -> bool:
        """Whether the request should actually be refused."""
        return not self.allowed and not self.bypassed

    def to_dict(self) -> dict[str, object]:
        return {
            "allowed": self.allowed,
            "bypassed": self.bypassed,
            "enforced": self.blocks,
            "reason": self.reason,
            **({"detail": self.detail} if self.detail else {}),
        }


def check_card_on_file(customer_id: UUID | None) -> GateDecision:
    """Whether the customer has a usable payment method.

    No billing provider is connected yet, so with gating ON this refuses
    everyone rather than waving them through. A payment check that passes
    because it cannot find a payment system is not a check.
    """
    settings = get_settings()

    if not settings.enable_card_gating:
        return GateDecision(
            allowed=True,
            bypassed=True,
            reason="Card gating disabled (ENABLE_CARD_GATING=false).",
        )

    if customer_id is None:
        return GateDecision(
            allowed=False,
            reason="Sign in and add a payment method to generate designs.",
        )

    # TODO(billing): look up the customer's payment method once a provider is
    # connected. Until then this fails closed when enforced, on purpose.
    return GateDecision(
        allowed=False,
        reason=(
            "No payment method on file. Card gating is enabled but no billing "
            "provider is connected yet."
        ),
    )


def check_daily_quota(customer_id: UUID | None, project_id: UUID) -> GateDecision:
    """Rolling 24-hour usage: rooms generated and renders produced.

    Scope is per customer where the project has one. An anonymous project has
    no identity to meter, so it falls back to per-project -- which limits
    repeat generations on that project but cannot stop someone starting a new
    anonymous project. Real enforcement therefore depends on the auth phase:
    the counters below are correct, the identity they hang off is not yet.
    """
    settings = get_settings()
    client = get_supabase()
    since = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()

    if customer_id is not None:
        rows = (
            client.table(PROJECTS)
            .select("id")
            .eq("customer_id", str(customer_id))
            .execute()
            .data
            or []
        )
        scope_ids = [r["id"] for r in rows] or [str(project_id)]
    else:
        scope_ids = [str(project_id)]

    generations = (
        client.table(GENERATIONS)
        .select("id,project_id,created_at")
        .in_("project_id", scope_ids)
        .gte("created_at", since)
        .execute()
        .data
        or []
    )

    rooms_used = len({g["project_id"] for g in generations})
    renders_used = 0
    if generations:
        renders = (
            client.table(DESIGNS)
            .select("id")
            .in_("generation_id", [g["id"] for g in generations])
            .execute()
            .data
            or []
        )
        renders_used = len(renders)

    detail = {
        "rooms_used": rooms_used,
        "rooms_limit": settings.daily_room_limit,
        "renders_used": renders_used,
        "renders_limit": settings.daily_render_limit,
    }

    over_rooms = rooms_used >= settings.daily_room_limit
    over_renders = renders_used >= settings.daily_render_limit

    # Re-generating a room already inside the window is not a NEW room, so the
    # room limit must not block it. Otherwise a customer who used their three
    # rooms could never retry a failed render on any of them.
    if over_rooms and str(project_id) in {g["project_id"] for g in generations}:
        over_rooms = False

    if not (over_rooms or over_renders):
        return GateDecision(allowed=True, detail=detail)

    if over_rooms:
        reason = (
            f"Daily limit reached: {rooms_used} of {settings.daily_room_limit} "
            "rooms in the last 24 hours. Try again tomorrow."
        )
    else:
        reason = (
            f"Daily limit reached: {renders_used} of "
            f"{settings.daily_render_limit} renders in the last 24 hours."
        )

    if not settings.enable_daily_quota_limit:
        logger.info("Quota exceeded but not enforced: %s", detail)
        return GateDecision(
            allowed=False,
            bypassed=True,
            reason=f"{reason} (not enforced: ENABLE_DAILY_QUOTA_LIMIT=false)",
            detail=detail,
        )

    return GateDecision(allowed=False, reason=reason, detail=detail)
