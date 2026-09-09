import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getVendorLeads } from "./mock-leads";
import { getProducts } from "./inventory";
import { DEV_BUSINESS_ID } from "./subscription-store";
import type { LeadStatus } from "./leads";

/**
 * Vendor analytics.
 *
 * Every figure is derived from rows the vendor actually has -- there are no
 * invented numbers. Where a figure is an estimate rather than a measurement
 * (pipeline revenue), the assumption is returned alongside it so the UI can
 * state it plainly instead of presenting a guess as a fact.
 *
 * All money is PKR, held as integer paisa.
 */

/**
 * Rooms are specified as a set, not a single item. Six pieces is the working
 * assumption for a furnished room; it is shown to the vendor, not hidden.
 */
export const ITEMS_PER_ROOM_ESTIMATE = 6;

export interface MonthlyPoint {
  /** "2026-04" */
  key: string;
  /** "Apr" */
  label: string;
  total: number;
  completed: number;
}

export interface VendorAnalytics {
  totalLeads: number;
  byStatus: Record<LeadStatus, number>;
  /** Completed / total, as a percentage rounded to one decimal. */
  conversionRate: number;
  activeCatalogItems: number;
  /** Open (uncompleted) leads x estimated project value, in PKR paisa. */
  pipelineRevenueMinor: number;
  /** Completed leads x estimated project value, in PKR paisa. */
  realisedRevenueMinor: number;
  /** Average active catalogue item price, in PKR paisa. Null with no priced items. */
  averageItemPriceMinor: number | null;
  /** averageItemPrice x ITEMS_PER_ROOM_ESTIMATE, in PKR paisa. */
  estimatedProjectValueMinor: number;
  monthly: MonthlyPoint[];
  /** Change in lead volume, latest month vs the one before. */
  leadVolumeDelta: number;
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** The last `count` months, oldest first, including the current one. */
function monthWindow(count: number, now: Date = new Date()): MonthlyPoint[] {
  const points: MonthlyPoint[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    points.push({
      key: monthKey(d),
      label: MONTH_LABELS[d.getMonth()],
      total: 0,
      completed: 0,
    });
  }
  return points;
}

interface LeadFact {
  status: LeadStatus;
  createdAt: string;
}

function aggregate(leads: LeadFact[], activeCatalogItems: number, pricesMinor: number[]): VendorAnalytics {
  const byStatus: Record<LeadStatus, number> = { new: 0, contacted: 0, completed: 0 };
  for (const lead of leads) byStatus[lead.status] += 1;

  const totalLeads = leads.length;
  const conversionRate =
    totalLeads === 0 ? 0 : Math.round((byStatus.completed / totalLeads) * 1000) / 10;

  const averageItemPriceMinor =
    pricesMinor.length === 0
      ? null
      : Math.round(pricesMinor.reduce((sum, p) => sum + p, 0) / pricesMinor.length);

  const estimatedProjectValueMinor =
    averageItemPriceMinor === null ? 0 : averageItemPriceMinor * ITEMS_PER_ROOM_ESTIMATE;

  const openLeads = byStatus.new + byStatus.contacted;

  const monthly = monthWindow(6);
  const index = new Map(monthly.map((m) => [m.key, m]));
  for (const lead of leads) {
    const point = index.get(monthKey(new Date(lead.createdAt)));
    if (!point) continue; // Older than the window.
    point.total += 1;
    if (lead.status === "completed") point.completed += 1;
  }

  const latest = monthly[monthly.length - 1]?.total ?? 0;
  const previous = monthly[monthly.length - 2]?.total ?? 0;

  return {
    totalLeads,
    byStatus,
    conversionRate,
    activeCatalogItems,
    pipelineRevenueMinor: openLeads * estimatedProjectValueMinor,
    realisedRevenueMinor: byStatus.completed * estimatedProjectValueMinor,
    averageItemPriceMinor,
    estimatedProjectValueMinor,
    monthly,
    leadVolumeDelta: latest - previous,
  };
}

export async function getVendorAnalytics(
  businessId: string = DEV_BUSINESS_ID,
): Promise<VendorAnalytics> {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    if (supabase) {
      const [leadsResult, productsResult] = await Promise.all([
        supabase
          .from("consultation_leads")
          .select("status, created_at")
          .eq("business_id", businessId),
        supabase
          .from("business_products")
          .select("price_minor")
          .eq("business_id", businessId)
          .eq("is_active", true),
      ]);

      if (!leadsResult.error && leadsResult.data) {
        const leads: LeadFact[] = leadsResult.data.map((row) => ({
          status: row.status as LeadStatus,
          createdAt: row.created_at as string,
        }));
        const products = productsResult.data ?? [];
        const prices = products
          .map((p) => p.price_minor as number | null)
          .filter((p): p is number => typeof p === "number");

        return aggregate(leads, products.length, prices);
      }
    }
  }

  // Local fallback. Access state does not matter here: analytics counts leads,
  // it never reads the contact fields the paywall gates.
  const leads = getVendorLeads(false);
  const products = await getProducts(businessId);
  const prices = products
    .map((p) => p.priceMinor)
    .filter((p): p is number => typeof p === "number");

  return aggregate(
    leads.map((l) => ({ status: l.status, createdAt: l.createdAt })),
    products.length,
    prices,
  );
}

/** 8_500_000 paisa -> "PKR 85,000". Compact form for large pipeline figures. */
export function formatPkrCompact(priceMinor: number): string {
  const rupees = Math.trunc(priceMinor / 100);
  if (rupees >= 10_000_000) return `PKR ${(rupees / 10_000_000).toFixed(2)} Cr`;
  if (rupees >= 100_000) return `PKR ${(rupees / 100_000).toFixed(2)} Lac`;
  return `PKR ${rupees.toLocaleString("en-US")}`;
}
