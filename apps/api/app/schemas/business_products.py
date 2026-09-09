"""Pydantic models for `business_products` (20260909_vendor_portal_core.sql).

The catalogue the AI pipeline retrieves from, so a generated concept can
specify items the customer can actually buy locally.

Money is an integer in the smallest currency unit (PKR paisa). Never a float:
binary floating point cannot represent 0.01 exactly, and a catalogue is
summed and compared.
"""

from __future__ import annotations

from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProductCategory(StrEnum):
    FURNITURE = "furniture"
    LIGHTING = "lighting"
    FINISH = "finish"
    FIXTURE = "fixture"
    OTHER = "other"


class ProductDimensions(BaseModel):
    """`dimensions` jsonb. Millimetres, so a spec never argues about units."""

    model_config = ConfigDict(extra="forbid")

    w_mm: int | None = Field(default=None, gt=0)
    h_mm: int | None = Field(default=None, gt=0)
    d_mm: int | None = Field(default=None, gt=0)


class BusinessProductBase(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    name: str = Field(min_length=1, max_length=120)
    category: ProductCategory = ProductCategory.FURNITURE
    description: str | None = None
    #: PKR paisa. 8_500_000 == PKR 85,000.
    price_minor: int | None = Field(default=None, ge=0)
    currency: str = Field(default="PKR", min_length=3, max_length=3)
    dimensions: ProductDimensions | None = None
    material: str | None = Field(default=None, max_length=120)
    colour_hex: str | None = Field(default=None, pattern=r"^#[0-9a-fA-F]{6}$")
    #: Paths inside the private storage bucket, not public URLs.
    image_paths: list[str] = Field(default_factory=list)
    in_stock: bool = True
    #: Retrieval key for the generation step. Must use the same eight-value
    #: vocabulary the customer wizard writes, or a style silently stops matching.
    style_tags: list[str] = Field(default_factory=list)

    @field_validator("currency")
    @classmethod
    def _upper_currency(cls, value: str) -> str:
        return value.upper()

    @field_validator("style_tags")
    @classmethod
    def _normalise_tags(cls, value: list[str]) -> list[str]:
        """Lower-case and de-duplicate, order preserved."""
        seen: set[str] = set()
        out: list[str] = []
        for tag in value:
            key = tag.strip().lower()
            if key and key not in seen:
                seen.add(key)
                out.append(key)
        return out


class BusinessProductCreate(BusinessProductBase):
    business_id: UUID


class BusinessProductUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str | None = Field(default=None, min_length=1, max_length=120)
    category: ProductCategory | None = None
    description: str | None = None
    price_minor: int | None = Field(default=None, ge=0)
    dimensions: ProductDimensions | None = None
    material: str | None = None
    colour_hex: str | None = Field(default=None, pattern=r"^#[0-9a-fA-F]{6}$")
    image_paths: list[str] | None = None
    in_stock: bool | None = None
    style_tags: list[str] | None = None
    is_active: bool | None = None


class BusinessProduct(BusinessProductBase):
    id: UUID
    business_id: UUID
    #: Soft delete. A product may already be named in a generated concept, so
    #: rows are archived rather than removed.
    is_active: bool = True
    created_at: datetime
    updated_at: datetime | None = None

    @property
    def price_pkr(self) -> float | None:
        """Display helper only. Do not do arithmetic on this value."""
        return None if self.price_minor is None else self.price_minor / 100
