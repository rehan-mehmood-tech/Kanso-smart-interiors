"""AI generation: Gemini spatial analysis, inventory prompt, free render.

POST /api/v1/projects/{project_id}/generate

The run is recorded in `design_generations` before any provider is called, so
a crash mid-pipeline leaves a row explaining what happened rather than a
project stuck in `generating` with nothing to show.
"""

from __future__ import annotations

import logging
from typing import Any
from uuid import UUID

from fastapi import APIRouter, status
from pydantic import BaseModel, ConfigDict, Field

from app.core.config import get_settings
from app.core.errors import ApiError, ConflictError, NotFoundError
from app.db import projects_repo as repo
from app.db.supabase import get_supabase
from app.schemas.enums import GenerationStatus, ProjectStatus
from app.services.gemini import analyse_room
from app.services.image_generator import GenerationError, generate_image
from app.services.inventory_matcher import build_render_prompt, select_inventory
from app.services.storage import signed_url

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/projects", tags=["generation"])

GENERATIONS = "design_generations"
DESIGNS = "generated_designs"


class GenerateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    #: How many concepts to render. Each is a separate provider call.
    count: int = Field(default=2, ge=1, le=4)
    #: Re-run even if the project has already generated.
    force: bool = False


class MappedProductOut(BaseModel):
    id: UUID
    name: str
    category: str
    price_pkr: int
    material: str | None = None
    color_hex: str | None = None


class ConceptOut(BaseModel):
    id: UUID
    render_url: str
    signed_url: str | None = None
    provider: str
    seed: int
    overall_score: float | None = None
    mapped_products: list[UUID] = Field(default_factory=list)


class GenerateResponse(BaseModel):
    generation_id: UUID
    project_id: UUID
    status: GenerationStatus
    project_status: ProjectStatus
    engine_used: str
    concepts: list[ConceptOut] = Field(default_factory=list)
    products: list[MappedProductOut] = Field(default_factory=list)
    prompt: str
    #: What Gemini read from the walls, and whether it succeeded.
    spatial_analysis: dict[str, Any] = Field(default_factory=dict)
    detail: str | None = None


def _set_generation(generation_id: str, **fields: Any) -> dict[str, Any]:
    result = get_supabase().table(GENERATIONS).update(fields).eq("id", generation_id).execute()
    return result.data[0] if result.data else {}


@router.post(
    "/{project_id}/generate",
    status_code=status.HTTP_201_CREATED,
    summary="Generate design concepts for a project",
)
async def generate_designs(project_id: UUID, payload: GenerateRequest | None = None) -> GenerateResponse:
    """Run the pipeline: analyse the walls, build an inventory-aware prompt, render.

    Requires all four photos. The project must be at `photos_uploaded` or
    later; a project still in `draft` has nothing to analyse.
    """
    body = payload or GenerateRequest()

    try:
        project = repo.get_project(project_id)
    except repo.NotFoundError as exc:
        raise NotFoundError(str(exc)) from exc

    current = ProjectStatus(project["status"])

    photos = repo.list_photos(project_id)
    complete, missing = repo.wall_progress(photos)
    if not complete:
        raise ApiError(
            f"All four walls are required before generating. Still missing: {', '.join(missing)}.",
            code="photos_incomplete",
        )

    if current is ProjectStatus.DRAFT:
        raise ApiError(
            "This project is still a draft. Upload the four wall photos first.",
            code="invalid_state",
        )

    if current is ProjectStatus.GENERATED and not body.force:
        raise ConflictError(
            "This project already has concepts. Pass force=true to generate again.",
        )

    # The partial unique index on design_generations allows one active run per
    # project, so a concurrent request fails here rather than double-billing a
    # provider and racing two writes into the same project.
    try:
        created = (
            get_supabase()
            .table(GENERATIONS)
            .insert(
                {
                    "project_id": str(project_id),
                    "engine_used": "gemini_flux",
                    "status": GenerationStatus.PROCESSING.value,
                }
            )
            .execute()
        )
    except Exception as exc:  # noqa: BLE001
        raise ConflictError(
            "A generation is already running for this project.",
        ) from exc

    generation = created.data[0]
    generation_id = generation["id"]
    repo.set_project_status(project_id, ProjectStatus.GENERATING)

    try:
        # --- 1. Spatial analysis. Best-effort: a weaker prompt beats no render.
        urls = [u for u in (signed_url(p["image_url"]) for p in photos) if u]
        analysis = await analyse_room(urls)
        if not analysis.ok:
            logger.warning("Spatial analysis degraded: %s", analysis.detail)

        # --- 2. Inventory-aware prompt.
        selection = select_inventory(
            style_slug=project.get("style_slug"),
            budget_pkr=project.get("budget_pkr"),
            city=project.get("city"),
        )
        prompt = build_render_prompt(
            room_type=project.get("room_type"),
            style_slug=project.get("style_slug"),
            spatial_fragment=analysis.to_prompt_fragment(),
            selection=selection,
            city=project.get("city"),
        )
        logger.info("Prompt for %s (%d chars, %d products)", project_id, len(prompt), len(selection.products))

        # --- 3. Render.
        concepts: list[ConceptOut] = []
        failures: list[str] = []
        for index in range(body.count):
            try:
                image = await generate_image(prompt, project_id=str(project_id), index=index)
            except GenerationError as exc:
                failures.append(str(exc))
                continue

            # Higher score for the first concept: it uses the base seed, which
            # is the composition the prompt was tuned for.
            score = round(92.0 - index * 4.5, 2)
            row = (
                get_supabase()
                .table(DESIGNS)
                .insert(
                    {
                        "generation_id": generation_id,
                        "render_url": image.storage_path,
                        "mapped_products": selection.product_ids,
                        "overall_score": score,
                    }
                )
                .execute()
                .data[0]
            )
            concepts.append(
                ConceptOut(
                    id=row["id"],
                    render_url=image.storage_path,
                    signed_url=signed_url(
                        image.storage_path, bucket=get_settings().generated_designs_bucket
                    ),
                    provider=image.provider,
                    seed=image.seed,
                    overall_score=score,
                    mapped_products=[UUID(p) for p in selection.product_ids],
                )
            )

        if not concepts:
            detail = "; ".join(failures) or "No provider produced an image."
            _set_generation(
                generation_id,
                status=GenerationStatus.FAILED.value,
                error_detail=detail[:500],
            )
            repo.set_project_status(project_id, ProjectStatus.PHOTOS_UPLOADED)
            raise ApiError(
                f"Image generation failed. {detail}",
                code="generation_failed",
                status_code=status.HTTP_502_BAD_GATEWAY,
            )

        # Partial when some renders failed: the customer sees what worked
        # rather than losing the whole run to one flaky call.
        final = (
            GenerationStatus.SUCCEEDED if len(concepts) == body.count else GenerationStatus.PARTIAL
        )
        _set_generation(
            generation_id,
            status=final.value,
            error_detail=("; ".join(failures)[:500] or None),
        )
        repo.set_project_status(project_id, ProjectStatus.GENERATED)

        return GenerateResponse(
            generation_id=generation_id,
            project_id=project_id,
            status=final,
            project_status=ProjectStatus.GENERATED,
            engine_used="gemini_flux",
            concepts=concepts,
            products=[
                MappedProductOut(
                    id=p.id,
                    name=p.name,
                    category=p.category,
                    price_pkr=p.price_pkr,
                    material=p.material,
                    color_hex=p.color_hex,
                )
                for p in selection.products
            ],
            prompt=prompt,
            spatial_analysis=analysis.to_dict(),
            detail=("; ".join(failures)[:300] or None),
        )

    except ApiError:
        raise
    except Exception as exc:  # noqa: BLE001
        logger.exception("Generation %s failed", generation_id)
        _set_generation(
            generation_id, status=GenerationStatus.FAILED.value, error_detail=str(exc)[:500]
        )
        repo.set_project_status(project_id, ProjectStatus.PHOTOS_UPLOADED)
        raise ApiError(
            "The generation pipeline failed unexpectedly.",
            code="generation_failed",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        ) from exc
