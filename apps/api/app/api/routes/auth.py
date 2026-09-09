"""Auth routes (PRD s18).

Supabase Auth owns credentials; this service brokers signup so that an
`auth.users` row and its `profiles` row (role=customer) are always created
together. Session hardening -- JWT verification, HTTP-only cookies, RBAC --
is its own phase.
"""

from __future__ import annotations

from fastapi import APIRouter

from app.core.errors import NotImplementedYetError

router = APIRouter(prefix="/auth", tags=["auth"])

_TODO = "Not built yet -- lands with the auth phase."


@router.post("/signup", summary="Create an account (role=customer)")
async def signup():
    raise NotImplementedYetError(_TODO)


@router.post("/login", summary="Exchange credentials for a Supabase session")
async def login():
    raise NotImplementedYetError(_TODO)


@router.post("/logout", summary="End the current session")
async def logout():
    raise NotImplementedYetError(_TODO)


@router.post("/reset-password", summary="Trigger a Supabase reset email")
async def reset_password():
    raise NotImplementedYetError(_TODO)
