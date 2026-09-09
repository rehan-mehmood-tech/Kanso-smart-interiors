import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Whether the signed-in business may see lead contact details.
 *
 * Calls the `business_has_paid_access(uuid)` function defined in
 * 20260909_vendor_portal_core.sql — the single definition of paid status, so
 * the rule cannot drift between the database and the app.
 *
 * This is a convenience for rendering. It is NOT the enforcement point: the
 * `leads_masked` view already returns NULL contact columns to an unpaid
 * business, so a bug here changes what the UI says, never what it can read.
 */

export type VendorTier = "free" | "solo_tradesman" | "shop_crew";

export interface VendorAccess {
  hasPaidAccess: boolean;
  tier: VendorTier;
  /** True when the answer is a local default rather than a database result. */
  isPreview: boolean;
}

const FREE_PREVIEW: VendorAccess = {
  hasPaidAccess: false,
  tier: "free",
  isPreview: true,
};

/**
 * Dev-only override so both gated states can be exercised before a Supabase
 * project exists. Never consulted once Supabase is configured, and never in a
 * production build.
 */
function previewOverride(override?: string): VendorAccess {
  if (process.env.NODE_ENV === "production") return FREE_PREVIEW;
  if (override === "paid") {
    return { hasPaidAccess: true, tier: "shop_crew", isPreview: true };
  }
  return FREE_PREVIEW;
}

export async function getVendorAccess(previewParam?: string): Promise<VendorAccess> {
  if (!isSupabaseConfigured) return previewOverride(previewParam);

  const supabase = await createClient();
  if (!supabase) return previewOverride(previewParam);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return FREE_PREVIEW;

  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_profile_id", user.id)
    .maybeSingle();

  if (!business) return FREE_PREVIEW;

  const { data: hasPaidAccess, error } = await supabase.rpc("business_has_paid_access", {
    b_id: business.id,
  });

  if (error) {
    // Fail closed: an unreadable subscription is not a paid one.
    return FREE_PREVIEW;
  }

  const { data: subscription } = await supabase
    .from("business_subscriptions")
    .select("tier")
    .eq("business_id", business.id)
    .maybeSingle();

  return {
    hasPaidAccess: Boolean(hasPaidAccess),
    tier: (subscription?.tier as VendorTier) ?? "free",
    isPreview: false,
  };
}
