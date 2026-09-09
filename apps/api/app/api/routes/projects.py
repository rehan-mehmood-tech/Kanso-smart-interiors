"""Projects, room photos, generation and designs (PRD s18).

Every route the MVP needs is declared here so the URL surface is fixed and the
Next.js client can be written against it. Handlers raise 501 until their slice
is built -- an honest "not built" beats a fake success.
"""

from __future__ import annotations

from fastapi import APIRouter, File, Form, Path, UploadFile

from app.core.errors import NotImplementedYetError

# Role guards (app.api.deps.require_customer) attach per route as each slice
# is built, alongside the ownership checks the PRD requires.
router = APIRouter(tags=["projects"])

_TODO = "Not built yet -- lands with the projects/generation slice."


@router.post("/projects", summary="Create a room project")
# room_type is free text in the schema, not an enum: the wizard offers a
# fixed list but "Other" accepts anything the customer types.
async def create_project(room_type: str, room_type_other_label: str | None = None):
    raise NotImplementedYetError(_TODO)


@router.get("/projects", summary="List the caller's projects")
async def list_projects():
    raise NotImplementedYetError(_TODO)


@router.get("/projects/{project_id}", summary="Project detail with photos and designs")
async def get_project(project_id: str = Path(...)):
    raise NotImplementedYetError(_TODO)


@router.patch("/projects/{project_id}/style", summary="Set the project's style")
async def set_project_style(project_id: str, style_id: str):
    raise NotImplementedYetError(_TODO)


# --- Room photos: exactly four walls, private bucket, signed URLs only ---


@router.post("/projects/{project_id}/photos", summary="Upload one wall photo")
async def upload_wall_photo(
    project_id: str,
    wall_number: int = Form(..., ge=1, le=4),
    file: UploadFile = File(...),
):
    raise NotImplementedYetError(_TODO)


@router.delete(
    "/projects/{project_id}/photos/{wall_number}", summary="Remove a wall photo (replace flow)"
)
async def delete_wall_photo(project_id: str, wall_number: int = Path(..., ge=1, le=4)):
    raise NotImplementedYetError(_TODO)


# --- Generation ---


@router.post("/projects/{project_id}/generate", summary="Start a generation run")
async def start_generation(project_id: str):
    """400 if fewer than four photos or no style; 409 if one is already running."""
    raise NotImplementedYetError("Not built yet -- lands with the AI pipeline slice.")


@router.get("/generations/{generation_id}", summary="Poll a generation run")
async def get_generation(generation_id: str):
    raise NotImplementedYetError("Not built yet -- lands with the AI pipeline slice.")


# --- Designs and interactions ---


@router.get("/projects/{project_id}/designs", summary="List generated concepts")
async def list_designs(project_id: str):
    raise NotImplementedYetError(_TODO)


@router.post("/designs/{design_id}/like", summary="Toggle like")
async def toggle_like(design_id: str):
    raise NotImplementedYetError(_TODO)


@router.post("/designs/{design_id}/save", summary="Toggle save")
async def toggle_save(design_id: str):
    raise NotImplementedYetError(_TODO)


@router.post("/projects/{project_id}/select-design", summary="Select the winning concept")
async def select_design(project_id: str, design_id: str):
    """Sets `room_projects.selected_design_id` -- the authoritative selection."""
    raise NotImplementedYetError(_TODO)
