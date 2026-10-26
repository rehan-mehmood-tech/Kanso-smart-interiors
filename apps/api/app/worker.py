"""Durable database-backed generation worker for Render.

The API only inserts pending jobs. This independently deployed process claims
one row atomically, so an HTTP process restart cannot discard accepted work.
The claim function also requeues stale processing rows after the configured
timeout, providing crash recovery without an external broker.
"""

from __future__ import annotations

import asyncio
import logging
import signal
from uuid import UUID

from app.api.v1.generation import _execute_pipeline
from app.core.config import get_settings
from app.core.errors import ApiError
from app.core.logging import configure_logging
from app.db import projects_repo as repo
from app.db.supabase import get_supabase

logger = logging.getLogger(__name__)
POLL_SECONDS = 2.0


def claim_job() -> dict | None:
    settings = get_settings()
    result = get_supabase().rpc(
        "claim_generation_job",
        {"p_stale_after_seconds": settings.generation_timeout_seconds + 120},
    ).execute()
    rows = result.data or []
    return rows[0] if rows else None


async def run_job(job: dict) -> None:
    project_id = UUID(str(job["project_id"]))
    try:
        await _execute_pipeline(
            project=repo.get_project(project_id),
            project_id=project_id,
            generation_id=str(job["id"]),
            count=int(job["requested_count"]),
            photos=repo.list_photos(project_id),
            gating_report=job.get("gating_report") or {},
        )
    except ApiError as exc:
        logger.warning("Generation %s ended: %s", job["id"], exc)
    except Exception:
        # _execute_pipeline records failures. This catch keeps the worker alive.
        logger.exception("Generation %s crashed", job["id"])


async def serve() -> None:
    stop = asyncio.Event()
    loop = asyncio.get_running_loop()
    for name in ("SIGINT", "SIGTERM"):
        if hasattr(signal, name):
            try:
                loop.add_signal_handler(getattr(signal, name), stop.set)
            except NotImplementedError:  # Windows development
                pass

    logger.info("Kanso generation worker started")
    while not stop.is_set():
        job = await asyncio.to_thread(claim_job)
        if job:
            await run_job(job)
            continue
        try:
            await asyncio.wait_for(stop.wait(), timeout=POLL_SECONDS)
        except TimeoutError:
            pass


if __name__ == "__main__":
    configure_logging(get_settings().log_level)
    asyncio.run(serve())
