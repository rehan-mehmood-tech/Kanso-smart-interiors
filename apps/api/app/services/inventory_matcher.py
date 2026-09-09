"""Inventory-aware prompt building.

The point of Kanso is that a generated concept specifies things the customer
can actually buy locally. This module picks those items out of
`business_products` and writes them into the render prompt by name, material
and colour, so the image and the shopping list describe the same room.

The selected product ids travel back with the prompt and are stored on
`generated_designs.mapped_products`, which is what lets the UI show "this sofa,
from this vendor, at this price" under the render.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from app.db.supabase import get_supabase

logger = logging.getLogger(__name__)

PRODUCTS = "business_products"

#: One of each is what furnishes a room; more than one sofa in a prompt just
#: confuses the renderer.
CATEGORY_PRIORITY: tuple[str, ...] = ("furniture", "lighting", "finish", "fixture")

#: Beyond this the prompt stops steering the image and starts diluting it.
MAX_ITEMS = 6


@dataclass
class MatchedProduct:
    id: str
    name: str
    category: str
    price_minor: int
    material: str | None = None
    color_hex: str | None = None
    dimensions: dict[str, Any] = field(default_factory=dict)
    style_tags: list[str] = field(default_factory=list)
    business_id: str | None = None

    @property
    def price_pkr(self) -> int:
        return self.price_minor // 100

    def describe(self) -> str:
        """One clause for the render prompt."""
        bits = [self.name]
        if self.material:
            bits.append(f"in {self.material}")
        if self.color_hex:
            bits.append(f"({self.color_hex})")
        dims = self.dimensions or {}
        w, h, d = dims.get("w_mm"), dims.get("h_mm"), dims.get("d_mm")
        if w and h:
            bits.append(f"{w}x{h}{'x' + str(d) if d else ''}mm")
        return " ".join(bits)


@dataclass
class InventorySelection:
    products: list[MatchedProduct] = field(default_factory=list)
    total_price_minor: int = 0
    #: True when the budget filter actually excluded something, so the caller
    #: can tell "nothing in budget" from "no inventory at all".
    budget_applied: bool = False
    considered: int = 0

    @property
    def product_ids(self) -> list[str]:
        return [p.id for p in self.products]

    @property
    def total_price_pkr(self) -> int:
        return self.total_price_minor // 100


def _row_to_product(row: dict[str, Any]) -> MatchedProduct:
    return MatchedProduct(
        id=row["id"],
        name=row["name"],
        category=row.get("category") or "other",
        price_minor=int(row.get("price_minor") or 0),
        material=row.get("material"),
        color_hex=row.get("color_hex"),
        dimensions=row.get("dimensions") or {},
        style_tags=list(row.get("style_tags") or []),
        business_id=row.get("business_id"),
    )


def select_inventory(
    *,
    style_slug: str | None,
    budget_pkr: int | None,
    city: str | None = None,
    limit: int = MAX_ITEMS,
) -> InventorySelection:
    """Choose catalogue items to specify in the render.

    Only active, in-stock products from live vendors are eligible -- a concept
    that specifies something nobody can sell is worse than a generic one.

    Style is matched with the array-overlap operator, which is what the GIN
    index on style_tags exists for. If nothing matches the style we widen to
    any in-stock item rather than returning nothing: a render with real local
    furniture in a loosely related style still beats an invented one.

    Budget is treated as a ceiling on the specified set, filled by category
    priority so a room gets a sofa before it gets a third lamp.
    """
    client = get_supabase()

    query = (
        client.table(PRODUCTS)
        .select("id,business_id,name,category,price_minor,material,color_hex,dimensions,style_tags")
        .eq("is_active", True)
        .eq("in_stock", True)
    )
    if style_slug:
        # PostgREST `overlaps` -> the SQL && operator, served by the GIN index.
        query = query.overlaps("style_tags", [style_slug])

    rows = query.limit(60).execute().data or []

    if not rows and style_slug:
        logger.info("No products tagged %s; widening to any in-stock item.", style_slug)
        rows = (
            client.table(PRODUCTS)
            .select("id,business_id,name,category,price_minor,material,color_hex,dimensions,style_tags")
            .eq("is_active", True)
            .eq("in_stock", True)
            .limit(60)
            .execute()
            .data
            or []
        )

    considered = len(rows)
    if not rows:
        return InventorySelection(considered=0)

    candidates = [_row_to_product(r) for r in rows]

    # Cheapest first inside each category, so a budget buys breadth (a sofa and
    # a light) rather than a single expensive piece.
    by_category: dict[str, list[MatchedProduct]] = {}
    for product in sorted(candidates, key=lambda p: p.price_minor):
        by_category.setdefault(product.category, []).append(product)

    budget_minor = budget_pkr * 100 if budget_pkr else None
    chosen: list[MatchedProduct] = []
    running = 0
    budget_applied = False

    ordered_categories = [c for c in CATEGORY_PRIORITY if c in by_category]
    ordered_categories += [c for c in by_category if c not in CATEGORY_PRIORITY]

    # Round-robin across categories so one category cannot fill the whole list.
    depth = 0
    while len(chosen) < limit:
        added_this_pass = False
        for category in ordered_categories:
            if len(chosen) >= limit:
                break
            bucket = by_category[category]
            if depth >= len(bucket):
                continue
            product = bucket[depth]
            if budget_minor is not None and running + product.price_minor > budget_minor:
                budget_applied = True
                continue
            chosen.append(product)
            running += product.price_minor
            added_this_pass = True
        if not added_this_pass:
            break
        depth += 1

    return InventorySelection(
        products=chosen,
        total_price_minor=running,
        budget_applied=budget_applied,
        considered=considered,
    )


def build_render_prompt(
    *,
    room_type: str | None,
    style_slug: str | None,
    spatial_fragment: str,
    selection: InventorySelection,
    city: str | None = None,
) -> str:
    """Assemble the final prompt.

    Order matters: the room comes first so the renderer anchors on the space,
    the mandated products next so they are treated as requirements rather than
    suggestions, and camera and quality direction last.
    """
    room = (room_type or "living room").replace("_", " ")
    style = (style_slug or "warm minimalist").replace("_", " ")

    parts: list[str] = [
        f"Photorealistic interior photograph of a {style} {room}."
    ]

    if spatial_fragment:
        parts.append(
            f"The room is a {spatial_fragment}. Preserve this exact geometry, "
            "window placement and proportions."
        )

    if selection.products:
        items = "; ".join(p.describe() for p in selection.products)
        parts.append(
            f"The room must be furnished with these specific pieces, rendered "
            f"faithfully to their stated material, colour and size: {items}."
        )
        if selection.total_price_minor:
            parts.append(
                f"Total specified furnishing value approximately PKR "
                f"{selection.total_price_pkr:,}."
            )
    else:
        parts.append(
            f"Furnish it with pieces typical of {style} interiors, in natural "
            "materials and a restrained palette."
        )

    parts.append(
        "Wide-angle architectural photography, eye-level camera, natural "
        "daylight, soft shadows, high detail, magazine editorial quality. "
        "No people, no text, no watermarks."
    )
    return " ".join(parts)
