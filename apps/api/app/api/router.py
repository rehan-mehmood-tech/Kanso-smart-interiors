"""Aggregates the remaining stub route groups.

Projects, photos and leads used to live here as 501 placeholders. They are now
implemented for real in app/api/v1/, so the stubs are gone -- two /projects
surfaces returning different things is worse than one honest gap.

Auth, business and admin remain as declared-but-unimplemented routes.
"""

from __future__ import annotations

from fastapi import APIRouter

from app.api.routes import admin, auth, business

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(business.router)
api_router.include_router(admin.router)
