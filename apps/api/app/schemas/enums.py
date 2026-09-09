"""Controlled vocabularies, mirroring the PRD data model (s17).

These are the single source of truth for the API layer. When the Supabase
migrations land they must declare the same values, in the same spelling.
"""

from __future__ import annotations

from enum import StrEnum


class UserRole(StrEnum):
    CUSTOMER = "customer"
    BUSINESS = "business"
    ADMIN = "admin"


class AccountStatus(StrEnum):
    ACTIVE = "active"
    DISABLED = "disabled"


class RoomType(StrEnum):
    BEDROOM = "bedroom"
    LIVING_ROOM = "living_room"
    DINING_ROOM = "dining_room"
    HOME_OFFICE = "home_office"
    KIDS_ROOM = "kids_room"
    OTHER = "other"


class ProjectStatus(StrEnum):
    DRAFT = "draft"
    PHOTOS_UPLOADED = "photos_uploaded"
    READY_FOR_GENERATION = "ready_for_generation"
    GENERATING = "generating"
    GENERATED = "generated"
    DESIGN_SELECTED = "design_selected"
    CONSULTATION_REQUESTED = "consultation_requested"


class GenerationStatus(StrEnum):
    PENDING = "pending"
    PROCESSING = "processing"
    SUCCEEDED = "succeeded"
    #: Fewer concepts came back than requested; the user still sees what worked.
    PARTIAL = "partial"
    FAILED = "failed"


class InteractionType(StrEnum):
    LIKE = "like"
    SAVE = "save"
    SELECT = "select"


class LeadStatus(StrEnum):
    NEW = "new"
    CONTACTED = "contacted"
    COMPLETED = "completed"


#: A project needs all four walls before generation can start (PRD s14).
REQUIRED_WALL_COUNT = 4
WALL_NUMBERS = (1, 2, 3, 4)
