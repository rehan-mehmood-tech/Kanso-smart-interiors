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

from app.api.deps import CurrentUserDep, assert_owns_project
from app.core.config import get_settings
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
    # `customer_id` is deliberately absent. The owner is taken from the verified
    # access token; accepting it from the body would let a caller create
    # projects belonging to someone else.


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
    #: This caller's interaction state, so the results page renders the right
    #: icon on first paint instead of flashing an unliked heart.
    liked: bool = False
    saved: bool = False


class ProductOut(BaseModel):
    """A catalogue item specified in one of the concepts.

    Prices are whole rupees. The stored column is integer paisa, converted once
    here so no float ever touches a money value.
    """

    id: UUID
    name: str
    category: str
    price_pkr: int
    material: str | None = None
    color_hex: str | None = None
    vendor_name: str | None = None
    vendor_city: str | None = None


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
    #: The concept the customer chose. Authoritative per PRD s31.
    selected_design_id: UUID | None = None
    photos: list[PhotoOut] = Field(default_factory=list)
    progress: WallProgress
    generations: list[GenerationOut] = Field(default_factory=list)
    #: Empty until a generation has produced concepts.
    designs: list[DesignOut] = Field(default_factory=list)
    #: Every product referenced by any design above, resolved to name, price
    #: and vendor. Sent with the project so a results page reloaded days later
    #: renders the shopping list without replaying the generation.
    products: list[ProductOut] = Field(default_factory=list)


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


def _product_out(row: dict[str, Any]) -> ProductOut:
    vendor = row.get("businesses") or {}
    return ProductOut(
        id=row["id"],
        name=row["name"],
        category=row.get("category") or "other",
        # Integer division: paisa -> rupees, never a float.
        price_pkr=int(row.get("price_minor") or 0) // 100,
        material=row.get("material"),
        color_hex=row.get("color_hex"),
        vendor_name=vendor.get("name"),
        vendor_city=vendor.get("city"),
    )


# -----------------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------------


@router.post("", status_code=status.HTTP_201_CREATED, summary="Create a room project")
async def create_project(payload: ProjectCreateRequest, user: CurrentUserDep) -> ProjectOut:
    """Start a design project.

    The owner is the authenticated caller, per PRD s8.1 where signup precedes
    Start Design. The project opens in `draft`.
    """
    row = repo.create_project(
        city=payload.city,
        room_type=payload.room_type,
        style_slug=payload.style_slug,
        budget_pkr=payload.budget_pkr,
        customer_id=UUID(user.id),
    )
    return ProjectOut(**row, progress=_progress([]))


@router.get("/{project_id}", summary="Project detail, photos and concepts")
async def get_project(project_id: UUID, user: CurrentUserDep) -> ProjectOut:
    try:
        project = repo.get_project(project_id)
    except repo.NotFoundError as exc:
        raise NotFoundError(str(exc)) from exc
    assert_owns_project(user, project)

    photos = repo.list_photos(project_id)
    generations = repo.list_generations(project_id)
    designs = repo.list_designs_for_generations([g["id"] for g in generations])

    # One query for every like/save this user has on this project, rather than
    # two per concept.
    interactions = repo.list_interactions_for_project(UUID(user.id), project_id)
    liked = {str(i["design_id"]) for i in interactions if i["interaction_type"] == "like"}
    saved = {str(i["design_id"]) for i in interactions if i["interaction_type"] == "save"}

    design_products = [
        DesignOut(
            id=d["id"],
            generation_id=d["generation_id"],
            render_url=d["render_url"],
            signed_url=signed_url(d["render_url"], bucket=get_settings().generated_designs_bucket),
            mapped_products=_coerce_products(d.get("mapped_products")),
            overall_score=float(d["overall_score"]) if d.get("overall_score") is not None else None,
            liked=str(d["id"]) in liked,
            saved=str(d["id"]) in saved,
        )
        for d in designs
    ]

    # De-duplicated across concepts: two designs usually specify the same
    # pieces, and the client should not receive the same product twice.
    product_ids = {str(pid) for d in design_products for pid in d.mapped_products}
    products = [_product_out(r) for r in repo.list_products_by_ids(sorted(product_ids))]

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
        designs=design_products,
        products=products,
    )


@router.post(
    "/{project_id}/photos",
    status_code=status.HTTP_201_CREATED,
    summary="Upload or replace one wall photo",
)
async def upload_photo(
    project_id: UUID,
    user: CurrentUserDep,
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
        existing = repo.get_project(project_id)
    except repo.NotFoundError as exc:
        raise NotFoundError(str(exc)) from exc
    assert_owns_project(user, existing)

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
async def list_photos(project_id: UUID, user: CurrentUserDep) -> PhotoUploadResponse:
    try:
        project = repo.get_project(project_id)
    except repo.NotFoundError as exc:
        raise NotFoundError(str(exc)) from exc
    assert_owns_project(user, project)

    photos = repo.list_photos(project_id)
    return PhotoUploadResponse(
        project_id=project_id,
        status=ProjectStatus(project["status"]),
        walls=[_photo_out(p) for p in photos],
        progress=_progress(photos),
    )


class ProjectSummary(BaseModel):
    """One card on the customer dashboard.

    Deliberately not the full ProjectOut: a dashboard listing twenty projects
    does not need every photo, product and concept for each one.
    """

    id: UUID
    city: str | None = None
    room_type: str | None = None
    style_slug: str | None = None
    status: ProjectStatus
    created_at: str
    selected_design_id: UUID | None = None
    #: Concepts generated so far, for the "5 concepts" line on the card.
    design_count: int = 0
    #: A representative render for the card image. None before generation.
    thumbnail_url: str | None = None
    progress: WallProgress


class ProjectListResponse(BaseModel):
    projects: list[ProjectSummary]


class SelectDesignRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    design_id: UUID


@router.get("", summary="List the caller's projects")
async def list_projects(user: CurrentUserDep) -> ProjectListResponse:
    """Every project belonging to the authenticated customer, newest first.

    Powers the dashboard. Scoped by the token's user id, never by a query
    parameter -- a client-supplied owner would be a trivial way to read someone
    else's rooms.
    """
    rows = repo.list_projects_for_customer(UUID(user.id))
    if not rows:
        return ProjectListResponse(projects=[])

    ids = [str(r["id"]) for r in rows]
    counts = repo.count_designs_by_project(ids)
    thumbs = repo.first_design_for_projects(ids)
    photos_by_project = repo.list_photos_for_projects(ids)
    designs_bucket = get_settings().generated_designs_bucket

    summaries: list[ProjectSummary] = []
    for row in rows:
        pid = str(row["id"])
        thumb = thumbs.get(pid)
        summaries.append(
            ProjectSummary(
                id=row["id"],
                city=row.get("city"),
                room_type=row.get("room_type"),
                style_slug=row.get("style_slug"),
                status=ProjectStatus(row["status"]),
                created_at=row["created_at"],
                selected_design_id=row.get("selected_design_id"),
                design_count=counts.get(pid, 0),
                thumbnail_url=(
                    signed_url(thumb["render_url"], bucket=designs_bucket) if thumb else None
                ),
                progress=_progress(photos_by_project.get(pid, [])),
            )
        )
    return ProjectListResponse(projects=summaries)


@router.post("/{project_id}/select-design", summary="Choose the concept to take forward")
async def select_design(
    project_id: UUID, payload: SelectDesignRequest, user: CurrentUserDep
) -> ProjectOut:
    """Set the project's selected concept.

    Exactly one per project (PRD s10.12): writing the column replaces any
    previous choice, so there is never a second selection to clean up. The
    design must belong to this project -- otherwise a customer could attach
    someone else's render to their own consultation request.
    """
    try:
        project = repo.get_project(project_id)
    except repo.NotFoundError as exc:
        raise NotFoundError(str(exc)) from exc
    assert_owns_project(user, project)

    try:
        design_project_id = repo.project_id_for_design(payload.design_id)
    except repo.NotFoundError as exc:
        raise NotFoundError(str(exc)) from exc

    if design_project_id != str(project_id):
        raise ApiError(
            "That concept does not belong to this project.",
            code="design_project_mismatch",
        )

    repo.set_selected_design(project_id, payload.design_id)
    # History only; never the source of truth for what is selected.
    repo.record_selection_event(
        user_id=UUID(user.id), design_id=payload.design_id, project_id=project_id
    )

    return await get_project(project_id, user)
