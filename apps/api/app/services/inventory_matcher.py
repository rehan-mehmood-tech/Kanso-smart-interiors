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

#: Cap on the spatial reading inside the prompt.
#:
#: The provider truncates the whole semantic prompt at a fixed length (see
#: services/image_generator.py) by cutting the END. Gemini's room description
#: is the one part whose length is not under our control, so it is bounded
#: here -- otherwise a chatty analysis would push the room-type reinforcement
#: and the composition line past the cut, dropping exactly the instructions
#: that stop the model rendering the wrong kind of room.
MAX_SPATIAL_CHARS = 320


#: The furniture that defines each room type, and must be present whatever the
#: local catalogue happens to stock.
#:
#: This exists because of a real failure: a *bedroom* project rendered a sofa
#: and no bed. The cause was the instruction below to furnish using ONLY the
#: matched vendor pieces -- Rossi's catalogue has a sideboard, a coffee table
#: and a lounge chair but no bed, so the prompt literally forbade the one
#: piece that makes a bedroom a bedroom, and the model produced a sitting room.
#:
#: So the anchor leads the prompt and is never optional. Vendor stock is
#: additive on top of it, not a replacement for it.
ROOM_ANCHORS: dict[str, str] = {
    "bedroom": (
        "A fully furnished master bedroom featuring a prominent modern bed with "
        "headboard, pillows, duvet, nightstands, and cohesive interior lighting"
    ),
    "home_office": (
        "A fully furnished home office featuring a substantial desk, an ergonomic "
        "task chair, wall-mounted shelving, and a laptop workstation with focused "
        "task lighting"
    ),
    "living_room": (
        "A fully furnished living room featuring a large sofa, a coffee table, a "
        "media and TV unit, and accent chairs arranged around a clear seating axis"
    ),
    "dining_room": (
        "A fully furnished dining room featuring a full-size dining table with a "
        "matching set of dining chairs and a pendant light centred above the table"
    ),
    "kids_room": (
        "A fully furnished children's bedroom featuring a single bed with bedding, "
        "low accessible storage, a small study desk and soft, warm lighting"
    ),
}

#: Used when the room type is unknown or free text ("Other" in the wizard).
#: Still names furniture, so an unrecognised room never renders as an empty
#: shell -- the failure mode this whole table exists to prevent.
GENERIC_ANCHOR = (
    "A fully furnished room with a clear primary seating or resting piece, a "
    "surface for everyday use, storage, and cohesive interior lighting"
)


def room_anchor(room_type: str | None) -> str:
    """The mandatory core furniture clause for a room type.

    `office` is accepted alongside `home_office` because the wizard's id and
    everyday shorthand differ, and a near-miss here would silently drop the
    anchor -- exactly the case this guards.
    """
    if not room_type:
        return GENERIC_ANCHOR
    key = room_type.strip().lower().replace(" ", "_").replace("-", "_")
    aliases = {
        "office": "home_office",
        "study": "home_office",
        "master_bedroom": "bedroom",
        "guest_bedroom": "bedroom",
        "lounge": "living_room",
        "drawing_room": "living_room",
        "sitting_room": "living_room",
        "tv_lounge": "living_room",
        "kids_bedroom": "kids_room",
        "children_room": "kids_room",
        "nursery": "kids_room",
        "dining": "dining_room",
    }
    key = aliases.get(key, key)
    return ROOM_ANCHORS.get(key, GENERIC_ANCHOR)


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
    #: How many verified, paid vendors were eligible at all.
    vendors_available: int = 0
    #: True when no product matched the style and the style filter was relaxed.
    style_widened: bool = False

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


def _bookable_paid_business_ids() -> list[str]:
    """Businesses whose stock may be specified in a concept.

    Three conditions, all of them load-bearing:

      active + not banned  a suspended vendor cannot fulfil an order
      verified             an unvetted vendor should not be recommended
      paid access          business_has_paid_access() -- the same predicate
                           the lead paywall uses, so a vendor whose stock is
                           advertised is a vendor who can actually receive the
                           resulting lead

    That last one is the point of "no unpurchasable furniture": specifying a
    product from a vendor who cannot see the customer's contact details would
    render a shopping list nobody can act on.
    """
    client = get_supabase()
    rows = (
        client.table("businesses")
        .select("id,name")
        .eq("is_active", True)
        .eq("is_banned", False)
        .not_.is_("verified_at", "null")
        .execute()
        .data
        or []
    )

    allowed: list[str] = []
    for business in rows:
        try:
            result = client.rpc("business_has_paid_access", {"b_id": business["id"]}).execute()
            if result.data is True:
                allowed.append(business["id"])
        except Exception as exc:  # noqa: BLE001 - a failed check is not a pass
            logger.warning("Paid-access check failed for %s: %s", business["id"], exc)
    return allowed


def select_inventory(
    *,
    style_slug: str | None,
    budget_pkr: int | None,
    city: str | None = None,
    limit: int = MAX_ITEMS,
) -> InventorySelection:
    """Choose catalogue items to specify in the render.

    Eligibility is strict: active and in stock, from a vendor that is active,
    not banned, verified AND holds paid access. A concept that specifies
    something nobody can sell -- or that comes from a vendor who cannot act on
    the lead -- is worse than a generic one.

    Style is matched with the array-overlap operator, which is what the GIN
    index on style_tags exists for. If nothing matches the style we widen the
    STYLE filter only; the vendor eligibility rule is never relaxed.

    Budget is a ceiling on the specified set, filled by category priority so a
    room gets a sofa before it gets a third lamp.
    """
    client = get_supabase()

    business_ids = _bookable_paid_business_ids()
    if not business_ids:
        logger.info("No verified, paid vendors: nothing may be specified.")
        return InventorySelection(considered=0, vendors_available=0)

    columns = "id,business_id,name,category,price_minor,material,color_hex,dimensions,style_tags"

    def _query(with_style: bool):
        q = (
            client.table(PRODUCTS)
            .select(columns)
            .eq("is_active", True)
            .eq("in_stock", True)
            .in_("business_id", business_ids)
        )
        if with_style and style_slug:
            # PostgREST `overlaps` -> the SQL && operator, served by the GIN index.
            q = q.overlaps("style_tags", [style_slug])
        return q.limit(60).execute().data or []

    rows = _query(with_style=True)
    style_widened = False
    if not rows and style_slug:
        logger.info("No %s products from paid vendors; widening style only.", style_slug)
        rows = _query(with_style=False)
        style_widened = True

    considered = len(rows)
    if not rows:
        return InventorySelection(considered=0, vendors_available=len(business_ids))

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
        vendors_available=len(business_ids),
        style_widened=style_widened,
    )


def build_render_prompt(
    *,
    room_type: str | None,
    style_slug: str | None,
    spatial_fragment: str,
    selection: InventorySelection,
    city: str | None = None,
) -> str:
    """Assemble the render prompt.

    Order is the whole trick here, and it was learned twice.

    First: leading with a long spatial description and appending the furniture
    produced consistently EMPTY rooms. The model spent its attention
    reproducing the geometry it was told to preserve and treated the furniture
    as trailing detail. So the furnished scene leads and the spatial reading
    follows as supporting context.

    Second: leading with the vendor stock produced MISCATEGORISED rooms -- a
    bedroom rendered as a sitting room, because the catalogue had no bed and
    the prompt said to use only the matched pieces. So the room's own anchor
    furniture now leads, is mandatory, and vendor stock is layered on top of
    it. The room type decides what the space *is*; the catalogue decides what
    can be bought in it.
    """
    room = (room_type or "living room").replace("_", " ")
    style = (style_slug or "warm minimalist").replace("_", " ")
    anchor = room_anchor(room_type)

    parts: list[str] = []

    # 1. What this room IS. Always present, never conditional on inventory, and
    # stated first so a truncated prompt still keeps it.
    parts.append(f"{anchor}, in a {style} style.")
    parts.append(
        f"This is a {room}: fully furnished and styled, never an empty or "
        "unfurnished space, and never a different kind of room."
    )

    # 2. What can actually be bought in it.
    if selection.products:
        items = ", ".join(p.describe() for p in selection.products)
        parts.append(f"It also contains these exact pieces: {items}.")
        parts.append(
            "Show each of those clearly, true to its stated material, colour "
            "and size. Add nothing else beyond the core furniture above and "
            "soft furnishings such as cushions, bedding, rugs and plants: "
            "every purchasable item shown must be one the customer can buy "
            "from the local vendor."
        )
        if selection.total_price_minor:
            parts.append(f"Furnishing value approximately PKR {selection.total_price_pkr:,}.")
    else:
        parts.append(
            "Furnish it completely in natural materials and a restrained "
            "palette, with soft lighting and textiles."
        )

    # 3. The customer's actual room, as read from their four photos.
    if spatial_fragment:
        spatial = spatial_fragment.strip()
        if len(spatial) > MAX_SPATIAL_CHARS:
            # Cut on a clause boundary so the fragment does not end mid-phrase.
            spatial = spatial[:MAX_SPATIAL_CHARS].rsplit(",", 1)[0]
        parts.append(f"Room: {spatial}. Keep this geometry and proportions.")

    # Composition intent stays here because it describes the shot of THIS
    # room. Rendering-quality modifiers do not: they are provider-specific and
    # are appended in services/image_generator.py, so there is one place to
    # tune them per engine.
    parts.append(
        "Wide-angle architectural photograph, eye-level camera, natural "
        "daylight with soft directional shadows."
    )
    return " ".join(parts)
