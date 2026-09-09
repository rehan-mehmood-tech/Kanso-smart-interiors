import type { StyleTag } from "./styles";

/**
 * Mirrors the `business_products` table from
 * supabase/migrations/20260909_vendor_portal_core.sql.
 */

export const PRODUCT_CATEGORIES = [
  { id: "furniture", label: "Furniture" },
  { id: "lighting", label: "Lighting" },
  { id: "finish", label: "Finishes" },
  { id: "fixture", label: "Fixtures" },
  { id: "other", label: "Other" },
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["id"];

export const PRODUCT_CATEGORY_IDS: readonly ProductCategory[] = PRODUCT_CATEGORIES.map(
  (c) => c.id,
);

export function categoryLabel(id: string): string {
  return PRODUCT_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export interface ProductDimensions {
  w_mm: number | null;
  h_mm: number | null;
  d_mm: number | null;
}

export interface BusinessProduct {
  id: string;
  businessId: string;
  name: string;
  category: ProductCategory;
  description: string | null;
  /** Smallest currency unit (PKR paisa). Integer arithmetic only. */
  priceMinor: number | null;
  currency: string;
  dimensions: ProductDimensions | null;
  material: string | null;
  colourHex: string | null;
  imagePaths: string[];
  inStock: boolean;
  isActive: boolean;
  styleTags: StyleTag[];
  createdAt: string;
  updatedAt: string;
}

/** What the form submits. `id` is absent when creating. */
export interface ProductInput {
  name: string;
  category: ProductCategory;
  description: string;
  /** Whole rupees as typed by the vendor; converted to paisa on write. */
  pricePkr: string;
  dimensions: { w_mm: string; h_mm: string; d_mm: string };
  material: string;
  colourHex: string;
  imagePaths: string[];
  styleTags: StyleTag[];
  inStock: boolean;
}

export type ProductActionResult =
  | { ok: true; product: BusinessProduct }
  | { ok: false; errors: Partial<Record<keyof ProductInput | "form", string>> };

/** 85_000_00 paisa -> "PKR 85,000". Never uses floats for the rupee value. */
export function formatPkr(priceMinor: number | null): string {
  if (priceMinor === null) return "Price on request";
  const rupees = Math.trunc(priceMinor / 100);
  const paisa = priceMinor % 100;
  const grouped = rupees.toLocaleString("en-US");
  return paisa === 0
    ? `PKR ${grouped}`
    : `PKR ${grouped}.${String(paisa).padStart(2, "0")}`;
}

/** "85,000" or "85000.50" -> 8_500_000 paisa. Returns null when blank. */
export function toPriceMinor(input: string): number | null {
  const cleaned = input.replace(/[,\s]/g, "").trim();
  if (cleaned === "") return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

export function priceMinorToInput(priceMinor: number | null): string {
  if (priceMinor === null) return "";
  const rupees = priceMinor / 100;
  return Number.isInteger(rupees) ? String(rupees) : rupees.toFixed(2);
}

export function formatDimensions(d: ProductDimensions | null): string | null {
  if (!d) return null;
  const parts = [d.w_mm, d.h_mm, d.d_mm];
  if (parts.every((p) => p === null)) return null;
  return `${parts.map((p) => (p === null ? "—" : p)).join(" × ")} mm`;
}
