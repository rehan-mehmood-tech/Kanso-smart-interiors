"""Customer design pipeline: projects and wall photos.

Mounted at /api/v1/projects. Real Supabase persistence; AI generation is a
separate part, so a project simply reports an empty `designs` array until a
run exists.
"""

from __future__ import annotations

import logging
from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, File, Form, UploadFile, status
from pydantic import BaseModel, ConfigDict, Field

from app.core.errors import ApiError, NotFoundError
from app.db import projects_repo as repo
from app.schemas.enums import ProjectStatus, WallAngle
from app.services.storage import UploadError, decode_base64_image, signed_url, upload_wall_photo

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/projects", tags=["projects"])


# -----------------------------------------------------------------------------
# Request / response models
# -----------------------------------------------------------------------------


class ProjectCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    city: str | None = Field(default="Lahore", max_length=120)
    room_type: str | None = Field(default=None, max_length=60)
    style_slug: str | None = Field(default=None, max_length=60)
    #: Whole rupees.
    budget_pkr: int | None = Field(default=None, ge=0)
    customer_id: UUID | None = None


class PhotoOut(BaseModel):
    id: UUID
    wall_angle: WallAngle
    #: Object path inside the private bucket.
    image_url: str
    #: Time-limited URL for displaying it. None if signing failed.
    signed_url: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class WallProgress(BaseModel):
    completed: bool
    missing: list[str]
    uploaded: int
    required: int = 4


class PhotoUploadResponse(BaseModel):
    project_id: UUID
    status: ProjectStatus
    walls: list[PhotoOut]
    progress: WallProgress


class DesignOut(BaseModel):
    id: UUID
    generation_id: UUID
    render_url: str
    signed_url: str | None = None
    mapped_products: list[UUID] = Field(default_factory=list)
    overall_score: float | None = None


class GenerationOut(BaseModel):
    id: UUID
    status: str
    engine_used: str
    error_detail: str | None = None


class ProjectOut(BaseModel):
    id: UUID
    customer_id: UUID | None = None
    city: str | None = None
    room_type: str | None = None
    style_slug: str | None = None
    budget_pkr: int | None = None
    status: ProjectStatus
    created_at: str
    photos: list[PhotoOut] = Field(default_factory=list)
    progress: WallProgress
    generations: list[GenerationOut] = Field(default_factory=list)
    #: Empty until a generation has produced concepts.
    designs: list[DesignOut] = Field(default_factory=list)


# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------


def _photo_out(row: dict[str, Any]) -> PhotoOut:
    return PhotoOut(
        id=row["id"],
        wall_angle=row["wall_angle"],
        image_url=row["image_url"],
        signed_url=signed_url(row["image_url"]),
        metadata=row.get("metadata") or {},
    )


def _progress(photos: list[dict[str, Any]]) -> WallProgress:
    complete, missing = repo.wall_progress(photos)
    return WallProgress(completed=complete, missing=missing, uploaded=len(photos))


def _coerce_products(value: Any) -> list[UUID]:
    if not value:
        return []
    if isinstance(value, str):
        import json

        value = json.loads(value)
    out: list[UUID] = []
    for item in value:
        try:
            out.append(UUID(str(item)))
        except ValueError:
            continue
    return out


# -----------------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------------


@router.post("", status_code=status.HTTP_201_CREATED, summary="Create a room project")
async def create_project(payload: ProjectCreateRequest) -> ProjectOut:
    """Start a design project.

    `customer_id` is optional: the wizard runs before signup, and the row is
    claimed later. The project opens in `draft`.
    """
    row = repo.create_project(
        city=payload.city,
        room_type=payload.room_type,
        style_slug=payload.style_slug,
        budget_pkr=payload.budget_pkr,
        customer_id=payload.customer_id,
    )
    return ProjectOut(**row, progress=_progress([]))


@router.get("/{project_id}", summary="Project detail, photos and concepts")
async def get_project(project_id: UUID) -> ProjectOut:
    try:
        project = repo.get_project(project_id)
    except repo.NotFoundError as exc:
        raise NotFoundError(str(exc)) from exc

    photos = repo.list_photos(project_id)
    generations = repo.list_generations(project_id)
    designs = repo.list_designs_for_generations([g["id"] for g in generations])

    return ProjectOut(
        **project,
        photos=[_photo_out(p) for p in photos],
        progress=_progress(photos),
        generations=[
            GenerationOut(
                id=g["id"],
                status=g["status"],
                engine_used=g["engine_used"],
                error_detail=g.get("error_detail"),
            )
            for g in generations
        ],
        designs=[
            DesignOut(
                id=d["id"],
                generation_id=d["generation_id"],
                render_url=d["render_url"],
                signed_url=signed_url(d["render_url"], bucket=None),
                mapped_products=_coerce_products(d.get("mapped_products")),
                overall_score=float(d["overall_score"]) if d.get("overall_score") is not None else None,
            )
            for d in designs
        ],
    )


@router.post(
    "/{project_id}/photos",
    status_code=status.HTTP_201_CREATED,
    summary="Upload or replace one wall photo",
)
async def upload_photo(
    project_id: UUID,
    wall_angle: Annotated[WallAngle, Form(description="north, south, east or west")],
    file: Annotated[UploadFile | None, File(description="Image file")] = None,
    image_base64: Annotated[str | None, Form(description="Base64 or data: URI")] = None,
    image_url: Annotated[str | None, Form(description="Existing storage path or URL")] = None,
) -> PhotoUploadResponse:
    """Attach one wall capture.

    Accepts a multipart file, a base64 payload, or an already-stored path --
    exactly one of the three. Re-uploading the same wall replaces it, because
    the table has UNIQUE (project_id, wall_angle); a retry after a dropped
    mobile connection cannot leave the project with five photos.

    Once all four walls are present the project moves to `photos_uploaded`.
    """
    try:
        repo.get_project(project_id)
    except repo.NotFoundError as exc:
        raise NotFoundError(str(exc)) from exc

    supplied = [s for s in (file, image_base64, image_url) if s]
    if len(supplied) != 1:
        raise ApiError(
            "Supply exactly one of: file, image_base64, image_url.",
            code="invalid_payload",
        )

    metadata: dict[str, Any] = {}
    try:
        if file is not None:
            data = await file.read()
            stored = upload_wall_photo(
                project_id=str(project_id), wall_angle=wall_angle.value, data=data
            )
            path = stored.path
            metadata = {
                "content_type": stored.content_type,
                "size_bytes": stored.size_bytes,
                "original_filename": file.filename,
            }
        elif image_base64:
            data = decode_base64_image(image_base64)
            stored = upload_wall_photo(
                project_id=str(project_id), wall_angle=wall_angle.value, data=data
            )
            path = stored.path
            metadata = {"content_type": stored.content_type, "size_bytes": stored.size_bytes}
        else:
            path = image_url  # type: ignore[assignment]
            metadata = {"source": "external"}
    except UploadError as exc:
        raise ApiError(str(exc), code="invalid_image") from exc

    repo.upsert_photo(
        project_id=project_id, wall_angle=wall_angle, image_url=path, metadata=metadata
    )

    photos = repo.list_photos(project_id)
    progress = _progress(photos)

    # Advance the project only from draft. A project already generating or
    # further along must not be dragged backwards by a photo replacement.
    project = repo.get_project(project_id)
    current = ProjectStatus(project["status"])
    if progress.completed and current is ProjectStatus.DRAFT:
        project = repo.set_project_status(project_id, ProjectStatus.PHOTOS_UPLOADED)
        current = ProjectStatus.PHOTOS_UPLOADED

    return PhotoUploadResponse(
        project_id=project_id,
        status=current,
        walls=[_photo_out(p) for p in photos],
        progress=progress,
    )


@router.get("/{project_id}/photos", summary="List wall photos and progress")
async def list_photos(project_id: UUID) -> PhotoUploadResponse:
    try:
        project = repo.get_project(project_id)
    except repo.NotFoundError as exc:
        raise NotFoundError(str(exc)) from exc

    photos = repo.list_photos(project_id)
    return PhotoUploadResponse(
        project_id=project_id,
        status=ProjectStatus(project["status"]),
        walls=[_photo_out(p) for p in photos],
        progress=_progress(photos),
    )
