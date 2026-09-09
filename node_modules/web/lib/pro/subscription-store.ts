import { PAID_STATUSES, TIERS, type SubscriptionStatus, type TierId } from "./tiers";

/**
 * In-memory stand-in for the `business_subscriptions` row, used until a
 * Supabase project exists.
 *
 * It lives on globalThis so it survives hot reloads, and is deliberately in a
 * separate module from the server actions: a "use server" file may only export
 * async functions, and both the actions and the access check need this state.
 *
 * Per-process and reset on restart. Fine for a stand-in, useless for anything
 * that must persist.
 */

export const DEV_BUSINESS_ID = "demo-business";

export interface SubscriptionRecord {
  businessId: string;
  tier: TierId;
  status: SubscriptionStatus;
  seats: number;
  seatsUsed: number;
  currentPeriodEnd: string | null;
  provider: string | null;
  providerRef: string | null;
  updatedAt: string;
}

function defaultRecord(): SubscriptionRecord {
  return {
    businessId: DEV_BUSINESS_ID,
    tier: "free",
    status: "expired",
    seats: 1,
    seatsUsed: 1,
    currentPeriodEnd: null,
    provider: null,
    providerRef: null,
    updatedAt: new Date().toISOString(),
  };
}

export function subscriptionStore(): Map<string, SubscriptionRecord> {
  const g = globalThis as typeof globalThis & {
    __kansoSubscriptions?: Map<string, SubscriptionRecord>;
  };
  if (!g.__kansoSubscriptions) {
    g.__kansoSubscriptions = new Map([[DEV_BUSINESS_ID, defaultRecord()]]);
  }
  return g.__kansoSubscriptions;
}

export function readSubscription(businessId: string = DEV_BUSINESS_ID): SubscriptionRecord {
  const store = subscriptionStore();
  const existing = store.get(businessId);
  if (existing) return existing;
  const created = { ...defaultRecord(), businessId };
  store.set(businessId, created);
  return created;
}

export function writeSubscription(record: SubscriptionRecord): SubscriptionRecord {
  subscriptionStore().set(record.businessId, record);
  return record;
}

/**
 * The same rule as the SQL `business_has_paid_access()`: a non-free tier, a
 * granting status, and a period that has not lapsed.
 */
export function recordHasPaidAccess(record: SubscriptionRecord): boolean {
  if (record.tier === "free") return false;

  // A canceled plan keeps access until the period it has already paid for
  // runs out; every other non-granting status closes the gate immediately.
  const granting =
    PAID_STATUSES.includes(record.status) ||
    (record.status === "canceled" && record.currentPeriodEnd !== null);
  if (!granting) return false;

  if (record.currentPeriodEnd && new Date(record.currentPeriodEnd) <= new Date()) {
    return false;
  }
  return true;
}

/** One month from now, as the next renewal date. */
export function nextPeriodEnd(from: Date = new Date()): string {
  const end = new Date(from);
  end.setMonth(end.getMonth() + 1);
  return end.toISOString();
}

export function seatsForTier(tier: TierId): number {
  return TIERS[tier].seats;
}
