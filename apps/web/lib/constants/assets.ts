/**
 * Central registry of unique local image assets.
 *
 * Zero-duplicate policy: no two cards, concepts, portfolio items or product
 * listings may render the same file. Every path below points at a distinct
 * photograph under `public/assets/` -- verified byte-unique by SHA-256 -- and
 * no path appears in more than one array.
 *
 * Local files only. Never add a CDN or external URL here; new assets go
 * through `scripts/download-media.js`, which owns the download and keeps the
 * one-photo-per-file guarantee.
 */

/** Four wall angles per room, twelve distinct captures in total. */
export const ROOM_ORIGINAL_WALLS = [
  "/assets/images/walls/wall-01.jpg",
  "/assets/images/walls/wall-02.jpg",
  "/assets/images/walls/wall-03.jpg",
  "/assets/images/walls/wall-04.jpg",
  "/assets/images/walls/wall-05.jpg",
  "/assets/images/walls/wall-06.jpg",
  "/assets/images/walls/wall-07.jpg",
  "/assets/images/walls/wall-08.jpg",
  "/assets/images/walls/wall-09.jpg",
  "/assets/images/walls/wall-10.jpg",
  "/assets/images/walls/wall-11.jpg",
  "/assets/images/walls/wall-12.jpg",
] as const;

/** Rendered interior outputs, shown as generated design concepts. */
export const AI_DESIGN_CONCEPTS = [
  "/assets/images/concepts/concept-01.jpg",
  "/assets/images/concepts/concept-02.jpg",
  "/assets/images/concepts/concept-03.jpg",
  "/assets/images/concepts/concept-04.jpg",
  "/assets/images/concepts/concept-05.jpg",
  "/assets/images/concepts/concept-06.jpg",
  "/assets/images/concepts/concept-07.jpg",
  "/assets/images/concepts/concept-08.jpg",
  "/assets/images/concepts/concept-09.jpg",
  "/assets/images/concepts/concept-10.jpg",
  "/assets/images/concepts/concept-11.jpg",
  "/assets/images/concepts/concept-12.jpg",
] as const;

/** Catalogue items: furniture, lighting, finishes, fixtures. */
export const CATALOG_PRODUCTS = [
  "/assets/images/products/sofa-green-velvet.jpg",
  "/assets/images/products/sofa-grey-tufted.jpg",
  "/assets/images/products/sofa-terracotta-detail.jpg",
  "/assets/images/products/armchair-ochre.jpg",
  "/assets/images/products/stool-oak.jpg",
  "/assets/images/products/cabinet-oak-wall.jpg",
  "/assets/images/products/chair-cream-tufted.jpg",
  "/assets/images/products/pendant-brass-cluster.jpg",
  "/assets/images/products/pendant-white-dome.jpg",
  "/assets/images/products/desk-lamp-and-clock.jpg",
  "/assets/images/products/bathroom-fittings.jpg",
  "/assets/images/products/kitchen-fittings.jpg",
] as const;

/** Showroom and completed-project showcases for vendor profiles. */
export const VENDOR_PORTFOLIOS = [
  "/assets/images/portfolios/portfolio-01.jpg",
  "/assets/images/portfolios/portfolio-02.jpg",
  "/assets/images/portfolios/portfolio-03.jpg",
  "/assets/images/portfolios/portfolio-04.jpg",
  "/assets/images/portfolios/portfolio-05.jpg",
  "/assets/images/portfolios/portfolio-06.jpg",
  "/assets/images/portfolios/portfolio-07.jpg",
  "/assets/images/portfolios/portfolio-08.jpg",
  "/assets/images/portfolios/portfolio-09.jpg",
  "/assets/images/portfolios/portfolio-10.jpg",
] as const;

export const ASSET_REGISTRY = {
  walls: ROOM_ORIGINAL_WALLS,
  concepts: AI_DESIGN_CONCEPTS,
  products: CATALOG_PRODUCTS,
  portfolios: VENDOR_PORTFOLIOS,
} as const;

export type AssetCategory = keyof typeof ASSET_REGISTRY;

/**
 * Stable 32-bit hash of a string. Deterministic across server and client, so
 * an entity keeps the same image between a server render and a hydration.
 */
function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Pick one asset for an entity.
 *
 * `identifier` should be the entity's stable id or slug -- the same entity then
 * always gets the same picture. Passing a list index instead is what
 * `getUniqueAssets` does internally to guarantee adjacent items differ.
 *
 * There is deliberately no `[0]` default anywhere: a missing identifier still
 * hashes to a spread position rather than collapsing every card onto the first
 * image, which is exactly the duplication this registry exists to prevent.
 */
export function getUniqueAsset(category: AssetCategory, identifier: string | number): string {
  const pool = ASSET_REGISTRY[category];
  const index =
    typeof identifier === "number"
      ? Math.abs(Math.trunc(identifier))
      : hashString(identifier);
  return pool[index % pool.length];
}

/**
 * Pick `count` assets that are guaranteed distinct from one another.
 *
 * Hashing alone cannot promise that: two ids can collide onto the same slot.
 * This walks forward from the hashed start position, so a list of N items
 * (N <= pool size) always renders N different pictures -- the guarantee the
 * zero-duplicate policy actually needs.
 *
 * Asking for more than the pool holds is a programming error, so it throws
 * rather than silently repeating.
 */
export function getUniqueAssets(
  category: AssetCategory,
  count: number,
  seed: string | number = 0,
): string[] {
  const pool = ASSET_REGISTRY[category];
  if (count > pool.length) {
    throw new Error(
      `Requested ${count} unique "${category}" assets but the registry holds ${pool.length}. ` +
        `Add more files via scripts/download-media.js.`,
    );
  }
  const start =
    typeof seed === "number" ? Math.abs(Math.trunc(seed)) : hashString(String(seed));
  return Array.from({ length: count }, (_, i) => pool[(start + i) % pool.length]);
}

/** The four wall angles for one room, always four different photographs. */
export function getRoomWallSet(projectId: string): string[] {
  return getUniqueAssets("walls", 4, projectId);
}
