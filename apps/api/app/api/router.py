"""Aggregates every route group behind the versioned API prefix."""

from __future__ import annotations

from fastapi import APIRouter

from app.api.routes import admin, auth, business, leads, projects

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(projects.router)
api_router.include_router(leads.router)
api_router.include_router(business.router)
api_router.include_router(admin.router)
