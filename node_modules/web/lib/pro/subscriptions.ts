"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { TIERS, type SubscriptionStatus, type TierId } from "./tiers";
import {
  DEV_BUSINESS_ID,
  nextPeriodEnd,
  readSubscription,
  recordHasPaidAccess,
  seatsForTier,
  writeSubscription,
  type SubscriptionRecord,
} from "./subscription-store";

/**
 * Subscription state for the vendor portal.
 *
 * Writes target the `business_subscriptions` row, which is what
 * `business_has_paid_access()` reads — so activating a plan here is the same
 * event that unmasks contact details in `leads_masked`. There is no second
 * switch to flip.
 */

export interface PaymentDetails {
  /** How the vendor chose to pay. */
  method: "card" | "payfast" | "jazzcash" | "easypaisa" | "bank_transfer";
  /** Provider-side reference, or the vendor's deposit slip reference. */
  reference?: string;
  /** Filename of an uploaded bank deposit receipt, when method is bank_transfer. */
  receiptName?: string;
}

export interface SubscriptionSummary {
  businessId: string;
  tier: TierId;
  status: SubscriptionStatus;
  seats: number;
  seatsUsed: number;
  currentPeriodEnd: string | null;
  hasPaidAccess: boolean;
  /** True when the answer came from the local store, not the database. */
  isPreview: boolean;
}

function toSummary(record: SubscriptionRecord, isPreview: boolean): SubscriptionSummary {
  return {
    businessId: record.businessId,
    tier: record.tier,
    status: record.status,
    seats: record.seats,
    seatsUsed: record.seatsUsed,
    currentPeriodEnd: record.currentPeriodEnd,
    hasPaidAccess: recordHasPaidAccess(record),
    isPreview,
  };
}

export async function getSubscriptionStatus(
  businessId: string = DEV_BUSINESS_ID,
): Promise<SubscriptionSummary> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("business_subscriptions")
        .select("business_id, tier, status, seats, current_period_end")
        .eq("business_id", businessId)
        .maybeSingle();

      if (!error && data) {
        const { count } = await supabase
          .from("business_members")
          .select("id", { count: "exact", head: true })
          .eq("business_id", businessId);

        const record: SubscriptionRecord = {
          businessId: data.business_id as string,
          tier: data.tier as TierId,
          status: data.status as SubscriptionStatus,
          seats: (data.seats as number) ?? 1,
          seatsUsed: count ?? 1,
          currentPeriodEnd: (data.current_period_end as string | null) ?? null,
          provider: null,
          providerRef: null,
          updatedAt: new Date().toISOString(),
        };
        return toSummary(record, false);
      }
    }
  }

  return toSummary(readSubscription(businessId), true);
}

/**
 * Activate a paid plan.
 *
 * Payment capture is not wired up: no provider credentials exist, so this
 * records the vendor's chosen method and activates the plan. A bank transfer
 * would normally sit in `past_due` until an admin confirms the deposit —
 * that review step lands with the real billing integration.
 */
export async function upgradeSubscription(
  businessId: string,
  newTier: TierId,
  paymentDetails: PaymentDetails,
): Promise<{ ok: boolean; error?: string; summary?: SubscriptionSummary }> {
  if (newTier === "free") {
    return { ok: false, error: "Choose a paid plan to upgrade." };
  }
  if (!TIERS[newTier]) {
    return { ok: false, error: "Unknown plan." };
  }

  const periodEnd = nextPeriodEnd();
  const seats = seatsForTier(newTier);

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.from("business_subscriptions").upsert(
        {
          business_id: businessId,
          tier: newTier,
          status: "active" satisfies SubscriptionStatus,
          seats,
          current_period_end: periodEnd,
          provider: paymentDetails.method === "card" ? "stripe" : "manual",
          provider_ref: paymentDetails.reference ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "business_id" },
      );

      if (error) return { ok: false, error: error.message };

      revalidateVendorSurfaces();
      return { ok: true, summary: await getSubscriptionStatus(businessId) };
    }
  }

  const current = readSubscription(businessId);
  const updated = writeSubscription({
    ...current,
    tier: newTier,
    status: "active",
    seats,
    seatsUsed: Math.min(current.seatsUsed, seats),
    currentPeriodEnd: periodEnd,
    provider: paymentDetails.method === "card" ? "stripe" : "manual",
    providerRef: paymentDetails.reference ?? paymentDetails.receiptName ?? null,
    updatedAt: new Date().toISOString(),
  });

  revalidateVendorSurfaces();
  return { ok: true, summary: toSummary(updated, true) };
}

/**
 * Cancel at period end rather than immediately: the vendor has paid for the
 * remainder of the month and keeps access until it lapses.
 */
export async function cancelSubscription(
  businessId: string = DEV_BUSINESS_ID,
): Promise<{ ok: boolean; error?: string; summary?: SubscriptionSummary }> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase
        .from("business_subscriptions")
        .update({ status: "canceled", updated_at: new Date().toISOString() })
        .eq("business_id", businessId);

      if (error) return { ok: false, error: error.message };
      revalidateVendorSurfaces();
      return { ok: true, summary: await getSubscriptionStatus(businessId) };
    }
  }

  const current = readSubscription(businessId);
  if (current.tier === "free") {
    return { ok: false, error: "There is no paid plan to cancel." };
  }

  const updated = writeSubscription({
    ...current,
    status: "canceled",
    updatedAt: new Date().toISOString(),
  });

  revalidateVendorSurfaces();
  return { ok: true, summary: toSummary(updated, true) };
}

/** Billing changes what every lead surface may show, so refresh all of them. */
function revalidateVendorSurfaces(): void {
  revalidatePath("/pro/settings/billing");
  revalidatePath("/pro/dashboard");
  revalidatePath("/pro/leads", "layout");
}
