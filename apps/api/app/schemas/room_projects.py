"""Pydantic models for the customer pipeline.

Covers `room_projects`, `room_photos`, `design_generations` and
`generated_designs` -- the "four photos, analyse, generate, select" flow.
"""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.enums import (
    ALL_WALL_ANGLES,
    GenerationEngine,
    GenerationStatus,
    ProjectStatus,
    WallAngle,
)

# -----------------------------------------------------------------------------
# room_projects
# -----------------------------------------------------------------------------


class RoomProjectBase(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    city: str | None = Field(default="Lahore", max_length=120)
    room_type: str | None = Field(default=None, max_length=60)
    style_slug: str | None = Field(default=None, max_length=60)
    #: Whole rupees. Distinct from business_products.price_minor, which is
    #: paisa -- a budget is a round number, a catalogue price is arithmetic.
    budget_pkr: int | None = Field(default=None, ge=0)


class RoomProjectCreate(RoomProjectBase):
    #: Nullable: the wizard can start before signup, and the row is claimed
    #: when the customer creates an account.
    customer_id: UUID | None = None


class RoomProjectUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    city: str | None = None
    room_type: str | None = None
    style_slug: str | None = None
    budget_pkr: int | None = Field(default=None, ge=0)
    status: ProjectStatus | None = None
    customer_id: UUID | None = None


class RoomProject(RoomProjectBase):
    id: UUID
    customer_id: UUID | None = None
    status: ProjectStatus = ProjectStatus.DRAFT
    created_at: datetime
    updated_at: datetime | None = None

    @property
    def is_claimed(self) -> bool:
        """False while the project is still anonymous."""
        return self.customer_id is not None


# -----------------------------------------------------------------------------
# room_photos
# -----------------------------------------------------------------------------


class RoomPhotoCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    project_id: UUID
    wall_angle: WallAngle
    #: Path inside the private bucket, not a public URL.
    image_url: str = Field(min_length=1)
    metadata: dict = Field(default_factory=dict)


class RoomPhoto(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    id: UUID
    project_id: UUID
    wall_angle: WallAngle
    image_url: str
    metadata: dict = Field(default_factory=dict)
    created_at: datetime


class WallCaptureSet(BaseModel):
    """The four walls of one project, and whether the set is complete.

    Generation is refused below four, so this is the check the API runs before
    accepting a generate request.
    """

    project_id: UUID
    photos: list[RoomPhoto] = Field(default_factory=list)

    @property
    def captured_angles(self) -> set[WallAngle]:
        return {p.wall_angle for p in self.photos}

    @property
    def missing_angles(self) -> list[WallAngle]:
        return [a for a in ALL_WALL_ANGLES if a not in self.captured_angles]

    @property
    def is_complete(self) -> bool:
        return not self.missing_angles


# -----------------------------------------------------------------------------
# design_generations
# -----------------------------------------------------------------------------


class DesignGenerationCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    project_id: UUID
    engine_used: GenerationEngine = GenerationEngine.GEMINI_FLUX


class DesignGeneration(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    id: UUID
    project_id: UUID
    engine_used: GenerationEngine = GenerationEngine.GEMINI_FLUX
    status: GenerationStatus = GenerationStatus.PENDING
    error_detail: str | None = None
    created_at: datetime
    updated_at: datetime | None = None

    @property
    def is_running(self) -> bool:
        """Matches the partial unique index that allows one active run per
        project, so the API's 409 and the database agree."""
        return self.status in (GenerationStatus.PENDING, GenerationStatus.PROCESSING)


# -----------------------------------------------------------------------------
# generated_designs
# -----------------------------------------------------------------------------


class GeneratedDesignCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    generation_id: UUID
    render_url: str = Field(min_length=1)
    #: Snapshot of the business_products ids this render depicted.
    mapped_products: list[UUID] = Field(default_factory=list)
    overall_score: Decimal | None = Field(default=None, ge=0, le=100)


class GeneratedDesign(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    id: UUID
    generation_id: UUID
    render_url: str
    mapped_products: list[UUID] = Field(default_factory=list)
    overall_score: Decimal | None = None
    created_at: datetime

    @field_validator("mapped_products", mode="before")
    @classmethod
    def _coerce_jsonb_array(cls, value: object) -> object:
        """`mapped_products` is jsonb, so the driver may hand back a JSON
        string rather than a list. Accept both."""
        if isinstance(value, str):
            import json

            return json.loads(value) or []
        return value or []
