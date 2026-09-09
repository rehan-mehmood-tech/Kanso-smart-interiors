"""Pydantic models for `profiles`.

One profile per `auth.users` row. `role` is the authorisation source of truth
and is only ever read from here server-side, never trusted from a request.
"""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.schemas.enums import UserRole


class ProfileBase(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    email: EmailStr
    full_name: str | None = Field(default=None, max_length=200)
    avatar_url: str | None = None


class ProfileCreate(ProfileBase):
    """New profiles are customers. Elevating a role is an admin action, so it
    is deliberately not settable at creation."""

    id: UUID


class ProfileUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    full_name: str | None = Field(default=None, max_length=200)
    avatar_url: str | None = None


class Profile(ProfileBase):
    id: UUID
    role: UserRole = UserRole.CUSTOMER
    created_at: datetime
    updated_at: datetime | None = None

    @property
    def is_admin(self) -> bool:
        return self.role is UserRole.ADMIN
