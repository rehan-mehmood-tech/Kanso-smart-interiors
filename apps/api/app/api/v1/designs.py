"""Design interactions: like, save and select.

Mounted at /api/v1/designs. Every route resolves the design back to its
project and checks that the caller owns it -- a design id is a bare UUID with
no owner of its own, so without that hop any signed-in user could like, save,
or inspect another customer's concepts.

PRD s10.12 defines the semantics:
  * like -- toggle, many allowed, engagement signal only
  * save -- toggle, many allowed, revisitable list
  * select -- exactly one per project (see projects.py)
"""

from __future__ import annotations

import logging
from uuid import UUID

from fastapi import APIRouter
from pydantic import BaseModel

from app.api.deps import CurrentUserDep, assert_owns_project
from app.core.errors import NotFoundError
from app.db import projects_repo as repo

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/designs", tags=["designs"])


class InteractionResponse(BaseModel):
    design_id: UUID
    liked: bool | None = None
    saved: bool | None = None


def _owned_project_for_design(user, design_id: UUID) -> str:
    """Resolve the design's project and confirm the caller owns it."""
    try:
        project_id = repo.project_id_for_design(design_id)
        project = repo.get_project(UUID(project_id))
    except repo.NotFoundError as exc:
        raise NotFoundError(str(exc)) from exc
    # Raises NotFound (not Forbidden) when the caller is a stranger, so the id
    # is not confirmed to exist.
    assert_owns_project(user, project)
    return project_id


@router.post("/{design_id}/like", summary="Like or unlike a concept")
async def like_design(design_id: UUID, user: CurrentUserDep) -> InteractionResponse:
    """Toggle a like. Idempotent in the sense that the state, not the tap, is
    what matters: the response says where it ended up."""
    project_id = _owned_project_for_design(user, design_id)
    liked = repo.toggle_interaction(
        user_id=UUID(user.id),
        design_id=design_id,
        project_id=project_id,
        interaction_type="like",
    )
    return InteractionResponse(design_id=design_id, liked=liked)


@router.post("/{design_id}/save", summary="Save or unsave a concept")
async def save_design(design_id: UUID, user: CurrentUserDep) -> InteractionResponse:
    """Toggle a save."""
    project_id = _owned_project_for_design(user, design_id)
    saved = repo.toggle_interaction(
        user_id=UUID(user.id),
        design_id=design_id,
        project_id=project_id,
        interaction_type="save",
    )
    return InteractionResponse(design_id=design_id, saved=saved)
