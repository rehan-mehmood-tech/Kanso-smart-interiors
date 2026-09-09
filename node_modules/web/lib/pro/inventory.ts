"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isStyleTag, type StyleTag } from "./styles";
import {
  PRODUCT_CATEGORY_IDS,
  toPriceMinor,
  type BusinessProduct,
  type ProductActionResult,
  type ProductCategory,
  type ProductInput,
} from "./inventory-types";

/**
 * Inventory data layer.
 *
 * Every query targets `business_products` and treats `style_tags` as a real
 * text[] so the GIN index (and later, Gemini retrieval) can use it.
 *
 * Until a Supabase project exists these fall back to an in-memory store so the
 * CRUD flow is exercisable end to end. The store lives on globalThis to
 * survive hot reloads; it is per-process and resets on restart, which is fine
 * for a stand-in and useless for anything else.
 */

const DEV_BUSINESS_ID = "demo-business";

interface MemoryStore {
  products: BusinessProduct[];
  seq: number;
}

function store(): MemoryStore {
  const g = globalThis as typeof globalThis & { __kansoInventory?: MemoryStore };
  if (!g.__kansoInventory) {
    g.__kansoInventory = { products: seedProducts(), seq: seedProducts().length };
  }
  return g.__kansoInventory;
}

function nowIso(): string {
  return new Date().toISOString();
}

function seedProducts(): BusinessProduct[] {
  const base = {
    businessId: DEV_BUSINESS_ID,
    currency: "PKR",
    isActive: true,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  return [
    {
      ...base,
      id: "prod-1",
      name: "Fluted Oak Sideboard",
      category: "furniture" as ProductCategory,
      description: "Solid white oak carcass with fluted door fronts and brass pulls.",
      priceMinor: 8_500_000,
      dimensions: { w_mm: 1800, h_mm: 750, d_mm: 450 },
      material: "White Oak",
      colourHex: "#C9B79C",
      imagePaths: ["/assets/images/styles/japandi.jpg"],
      inStock: true,
      styleTags: ["japandi", "warm_neutral", "minimal"] as StyleTag[],
    },
    {
      ...base,
      id: "prod-2",
      name: "Linen Bouclé Modular Sofa",
      category: "furniture" as ProductCategory,
      description: "Three-seat low-profile modular sofa in textured bouclé.",
      priceMinor: 21_000_000,
      dimensions: { w_mm: 2400, h_mm: 680, d_mm: 950 },
      material: "Linen Bouclé",
      colourHex: "#EAE8E3",
      imagePaths: ["/assets/images/styles/warm-neutral.jpg"],
      inStock: true,
      styleTags: ["warm_neutral", "minimal", "scandinavian"] as StyleTag[],
    },
    {
      ...base,
      id: "prod-3",
      name: "Blackened Steel Pendant",
      category: "lighting" as ProductCategory,
      description: "Hand-finished steel dome pendant, 3000K warm dimmable.",
      priceMinor: 1_850_000,
      dimensions: { w_mm: 320, h_mm: 280, d_mm: 320 },
      material: "Blackened Steel",
      colourHex: "#1B1C19",
      imagePaths: ["/assets/images/styles/industrial.jpg"],
      inStock: false,
      styleTags: ["industrial", "modern", "grey"] as StyleTag[],
    },
    {
      ...base,
      id: "prod-4",
      name: "Honed Travertine Slab",
      category: "finish" as ProductCategory,
      description: "Unfilled honed travertine, supplied per square metre.",
      priceMinor: 4_200_000,
      dimensions: { w_mm: 1200, h_mm: 20, d_mm: 600 },
      material: "Travertine",
      colourHex: "#D8CFC0",
      imagePaths: ["/assets/images/styles/luxury.jpg"],
      inStock: true,
      styleTags: ["luxury", "minimal", "warm_neutral"] as StyleTag[],
    },
  ];
}

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

function validate(input: ProductInput): Partial<Record<keyof ProductInput, string>> {
  const errors: Partial<Record<keyof ProductInput, string>> = {};

  if (!input.name || input.name.trim().length === 0) {
    errors.name = "Give the product a name.";
  } else if (input.name.trim().length > 120) {
    errors.name = "Keep the name under 120 characters.";
  }

  if (!PRODUCT_CATEGORY_IDS.includes(input.category)) {
    errors.category = "Choose a category.";
  }

  if (input.pricePkr.trim() !== "" && toPriceMinor(input.pricePkr) === null) {
    errors.pricePkr = "Enter a price in rupees, or leave it blank.";
  }

  if (input.colourHex.trim() !== "" && !/^#[0-9a-f]{6}$/i.test(input.colourHex.trim())) {
    // Matches the CHECK constraint on business_products.colour_hex.
    errors.colourHex = "Use a six-digit hex code, e.g. #C9B79C.";
  }

  for (const [key, value] of Object.entries(input.dimensions)) {
    if (value.trim() === "") continue;
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) {
      errors.dimensions = "Dimensions must be positive numbers in millimetres.";
      break;
    }
    void key;
  }

  const unknown = input.styleTags.filter((t) => !isStyleTag(t));
  if (unknown.length > 0) {
    errors.styleTags = `Unrecognised style tag: ${unknown.join(", ")}.`;
  }

  return errors;
}

function toDimension(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

function applyInput(input: ProductInput, existing?: BusinessProduct): BusinessProduct {
  const dims = {
    w_mm: toDimension(input.dimensions.w_mm),
    h_mm: toDimension(input.dimensions.h_mm),
    d_mm: toDimension(input.dimensions.d_mm),
  };
  const hasDims = dims.w_mm !== null || dims.h_mm !== null || dims.d_mm !== null;

  return {
    id: existing?.id ?? `prod-${Date.now().toString(36)}`,
    businessId: existing?.businessId ?? DEV_BUSINESS_ID,
    name: input.name.trim(),
    category: input.category,
    description: input.description.trim() || null,
    priceMinor: toPriceMinor(input.pricePkr),
    currency: "PKR",
    dimensions: hasDims ? dims : null,
    material: input.material.trim() || null,
    colourHex: input.colourHex.trim() || null,
    imagePaths: input.imagePaths,
    inStock: input.inStock,
    isActive: existing?.isActive ?? true,
    styleTags: input.styleTags.filter(isStyleTag),
    createdAt: existing?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };
}

// -----------------------------------------------------------------------------
// Supabase row mapping
// -----------------------------------------------------------------------------

type ProductRow = {
  id: string;
  business_id: string;
  name: string;
  category: string;
  description: string | null;
  price_minor: number | null;
  currency: string;
  dimensions: { w_mm?: number; h_mm?: number; d_mm?: number } | null;
  material: string | null;
  colour_hex: string | null;
  image_paths: string[] | null;
  in_stock: boolean;
  is_active: boolean;
  style_tags: string[] | null;
  created_at: string;
  updated_at: string;
};

function fromRow(row: ProductRow): BusinessProduct {
  return {
    id: row.id,
    businessId: row.business_id,
    name: row.name,
    category: row.category as ProductCategory,
    description: row.description,
    priceMinor: row.price_minor,
    currency: row.currency,
    dimensions: row.dimensions
      ? {
          w_mm: row.dimensions.w_mm ?? null,
          h_mm: row.dimensions.h_mm ?? null,
          d_mm: row.dimensions.d_mm ?? null,
        }
      : null,
    material: row.material,
    colourHex: row.colour_hex,
    imagePaths: row.image_paths ?? [],
    inStock: row.in_stock,
    isActive: row.is_active,
    styleTags: (row.style_tags ?? []).filter(isStyleTag),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(product: BusinessProduct) {
  return {
    business_id: product.businessId,
    name: product.name,
    category: product.category,
    description: product.description,
    price_minor: product.priceMinor,
    currency: product.currency,
    dimensions: product.dimensions,
    material: product.material,
    colour_hex: product.colourHex,
    image_paths: product.imagePaths,
    in_stock: product.inStock,
    is_active: product.isActive,
    // Sent as a real array so Postgres stores text[] and the GIN index applies.
    style_tags: product.styleTags,
    updated_at: product.updatedAt,
  };
}

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

/** Active products for a business, newest first. */
export async function getProducts(businessId: string = DEV_BUSINESS_ID): Promise<BusinessProduct[]> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("business_products")
        .select("*")
        .eq("business_id", businessId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data) return (data as ProductRow[]).map(fromRow);
    }
  }

  return store()
    .products.filter((p) => p.isActive && p.businessId === businessId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createProduct(input: ProductInput): Promise<ProductActionResult> {
  const errors = validate(input);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const product = applyInput(input);

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("business_products")
        .insert(toRow(product))
        .select("*")
        .single();

      if (error) return { ok: false, errors: { form: error.message } };
      revalidatePath("/pro/inventory");
      return { ok: true, product: fromRow(data as ProductRow) };
    }
  }

  store().products.unshift(product);
  revalidatePath("/pro/inventory");
  return { ok: true, product };
}

export async function updateProduct(
  productId: string,
  input: ProductInput,
): Promise<ProductActionResult> {
  const errors = validate(input);
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    if (supabase) {
      const existing = await supabase
        .from("business_products")
        .select("*")
        .eq("id", productId)
        .single();

      const merged = applyInput(
        input,
        existing.data ? fromRow(existing.data as ProductRow) : undefined,
      );

      const { data, error } = await supabase
        .from("business_products")
        .update(toRow(merged))
        .eq("id", productId)
        .select("*")
        .single();

      if (error) return { ok: false, errors: { form: error.message } };
      revalidatePath("/pro/inventory");
      return { ok: true, product: fromRow(data as ProductRow) };
    }
  }

  const s = store();
  const index = s.products.findIndex((p) => p.id === productId);
  if (index === -1) return { ok: false, errors: { form: "That product no longer exists." } };

  const updated = applyInput(input, s.products[index]);
  s.products[index] = updated;
  revalidatePath("/pro/inventory");
  return { ok: true, product: updated };
}

/** Stock toggle. Separated from updateProduct so a switch is one round trip. */
export async function setProductStock(
  productId: string,
  inStock: boolean,
): Promise<{ ok: boolean; error?: string }> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase
        .from("business_products")
        .update({ in_stock: inStock, updated_at: nowIso() })
        .eq("id", productId);

      if (error) return { ok: false, error: error.message };
      revalidatePath("/pro/inventory");
      return { ok: true };
    }
  }

  const product = store().products.find((p) => p.id === productId);
  if (!product) return { ok: false, error: "That product no longer exists." };
  product.inStock = inStock;
  product.updatedAt = nowIso();
  revalidatePath("/pro/inventory");
  return { ok: true };
}

/**
 * Archive, not delete. A product may already be named in a generated concept
 * or a lead's material schedule; removing the row would leave those dangling.
 */
export async function deleteProduct(
  productId: string,
): Promise<{ ok: boolean; error?: string }> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase
        .from("business_products")
        .update({ is_active: false, updated_at: nowIso() })
        .eq("id", productId);

      if (error) return { ok: false, error: error.message };
      revalidatePath("/pro/inventory");
      return { ok: true };
    }
  }

  const product = store().products.find((p) => p.id === productId);
  if (!product) return { ok: false, error: "That product no longer exists." };
  product.isActive = false;
  product.updatedAt = nowIso();
  revalidatePath("/pro/inventory");
  return { ok: true };
}
