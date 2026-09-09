import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { readSubscription, recordHasPaidAccess } from "./subscription-store";

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
 * Access before a Supabase project exists.
 *
 * The local subscription store is the source of truth here, so activating a
 * plan on the billing screen unmasks leads immediately -- the same single
 * event that `business_has_paid_access()` represents in SQL.
 *
 * `?access=paid` remains as a dev-only shortcut for exercising the gated state
 * without going through checkout. It never applies in a production build.
 */
function previewAccess(override?: string): VendorAccess {
  if (process.env.NODE_ENV !== "production" && override === "paid") {
    return { hasPaidAccess: true, tier: "shop_crew", isPreview: true };
  }

  const record = readSubscription();
  return {
    hasPaidAccess: recordHasPaidAccess(record),
    tier: record.tier,
    isPreview: true,
  };
}

export async function getVendorAccess(previewParam?: string): Promise<VendorAccess> {
  if (!isSupabaseConfigured) return previewAccess(previewParam);

  const supabase = await createClient();
  if (!supabase) return previewAccess(previewParam);

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
