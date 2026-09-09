"""Controlled vocabularies, mirroring 20260909_master_baseline_schema.sql.

The database is the source of truth. Every value here must exist in the
matching Postgres enum, spelled identically -- a mismatch fails at insert
time with a cryptic cast error rather than at import.
"""

from __future__ import annotations

from enum import StrEnum


class UserRole(StrEnum):
    """`user_role`"""

    CUSTOMER = "customer"
    BUSINESS = "business"
    ADMIN = "admin"


class BusinessKind(StrEnum):
    """`business_kind`"""

    SOLO_TRADESMAN = "solo_tradesman"
    SHOP_CREW = "shop_crew"


class LeadStatus(StrEnum):
    """`lead_status`"""

    NEW = "new"
    CONTACTED = "contacted"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class SubscriptionStatus(StrEnum):
    """`subscription_status`. Note the single-l `canceled`, matching the SQL."""

    TRIALING = "trialing"
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELED = "canceled"


class SubscriptionTier(StrEnum):
    """`subscription_tier`"""

    FREE_TRIAL = "free_trial"
    SOLO_TRADESMAN = "solo_tradesman"
    SHOP_CREW = "shop_crew"


class ProjectStatus(StrEnum):
    """`project_status`"""

    DRAFT = "draft"
    PHOTOS_UPLOADED = "photos_uploaded"
    READY_FOR_GENERATION = "ready_for_generation"
    GENERATING = "generating"
    GENERATED = "generated"
    DESIGN_SELECTED = "design_selected"
    CONSULTATION_REQUESTED = "consultation_requested"


class WallAngle(StrEnum):
    """`wall_angle`. Four walls, named by compass direction."""

    NORTH = "north"
    SOUTH = "south"
    EAST = "east"
    WEST = "west"


class GenerationEngine(StrEnum):
    """`generation_engine`"""

    GEMINI_FLUX = "gemini_flux"
    FREE_TRIAL = "free_trial"


class GenerationStatus(StrEnum):
    """`generation_status`"""

    PENDING = "pending"
    PROCESSING = "processing"
    SUCCEEDED = "succeeded"
    #: Fewer concepts came back than requested; the user still sees what worked.
    PARTIAL = "partial"
    FAILED = "failed"


class DisputeStatus(StrEnum):
    """`customer_disputes.status` -- a text column with a CHECK constraint."""

    PENDING = "pending"
    REVIEWING = "reviewing"
    RESOLVED = "resolved"
    DISMISSED = "dismissed"


#: A project needs all four walls before generation can start.
REQUIRED_WALL_COUNT = 4
ALL_WALL_ANGLES: tuple[WallAngle, ...] = (
    WallAngle.NORTH,
    WallAngle.SOUTH,
    WallAngle.EAST,
    WallAngle.WEST,
)
