import type { LucideIcon } from "lucide-react";
import { Hammer, Store, Sparkles } from "lucide-react";

/**
 * The one definition of partner pricing.
 *
 * Both the public /partners page and the in-portal billing screen read from
 * here, so a price can never be advertised at one figure and charged at
 * another. Ids match the `sub_tier` enum in
 * supabase/migrations/20260909_vendor_portal_core.sql.
 */

export type TierId = "free" | "solo_tradesman" | "shop_crew";

/** Mirrors the `sub_status` enum. */
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";

export interface Tier {
  id: TierId;
  name: string;
  /** Whole rupees per month. Zero for the free tier. PKR is the only currency. */
  pricePkr: number;
  seats: number;
  audience: string;
  summary: string;
  features: string[];
  cta: string;
  icon: LucideIcon;
  featured: boolean;
}

export const TIERS: Record<TierId, Tier> = {
  free: {
    id: "free",
    name: "Free Trial",
    pricePkr: 0,
    seats: 1,
    audience: "Evaluating Kanso",
    summary:
      "Browse assigned leads and see the brief. Customer contact details stay locked.",
    features: [
      "1 user seat",
      "Lead summaries: room, style, city",
      "Contact details locked",
    ],
    cta: "Current Plan",
    icon: Sparkles,
    featured: false,
  },
  solo_tradesman: {
    id: "solo_tradesman",
    name: "Solo Tradesman",
    pricePkr: 1999,
    seats: 1,
    audience: "Carpenters, plumbers, electricians, painters",
    summary:
      "For independent skilled workers taking on their own jobs, one at a time.",
    features: [
      "1 user seat",
      "Direct WhatsApp customer lead access",
      "Local area lead feed",
      "Profile badge",
      "Unlocked contact details",
    ],
    cta: "Subscribe Solo Pass",
    icon: Hammer,
    featured: false,
  },
  shop_crew: {
    id: "shop_crew",
    name: "Shop + Crew",
    pricePkr: 7999,
    seats: 5,
    audience: "Furniture showrooms, lighting outlets, design studios",
    summary:
      "For stores holding physical inventory and running work across a team.",
    features: [
      "Up to 5 user seats",
      "Full product inventory CRUD (AI generation pipeline mapping)",
      "Priority lead matching",
      "Multi-location support",
      "Verified vendor badge",
    ],
    cta: "Upgrade to Shop Pass",
    icon: Store,
    featured: true,
  },
};

/** The two paid plans, in upgrade order. */
export const PAID_TIERS: Tier[] = [TIERS.solo_tradesman, TIERS.shop_crew];

export const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  trialing: "Trialing",
  active: "Active",
  past_due: "Past Due",
  canceled: "Canceling",
  expired: "Expired",
};

/**
 * Statuses that grant paid access outright. Kept identical to the SQL
 * predicate `business_has_paid_access()`.
 *
 * `past_due` is absent on purpose: a failed card closes the gate now.
 * `canceled` is handled separately -- it keeps access until the paid period
 * ends, since the vendor has already paid for the month in hand.
 */
export const PAID_STATUSES: SubscriptionStatus[] = ["trialing", "active"];

export function formatTierPricePkr(tier: Tier): string {
  return tier.pricePkr === 0 ? "Free" : `PKR ${tier.pricePkr.toLocaleString("en-US")}`;
}
