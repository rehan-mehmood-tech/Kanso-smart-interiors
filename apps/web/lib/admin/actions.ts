"use server";

import { revalidatePath } from "next/cache";
import { adminStore } from "./store";
import { archiveProductsForBusiness } from "@/lib/pro/inventory";
import { readSubscription, writeSubscription } from "@/lib/pro/subscription-store";
import type {
  AdminBusiness,
  AdminLead,
  AdminUser,
  BusinessKind,
  Complaint,
  ComplaintStatus,
  ModerationLogEntry,
  TradeCategory,
} from "./types";

/**
 * Admin server actions.
 *
 * Reads and writes go through the in-memory admin store until Supabase exists;
 * every function is shaped for the query that replaces it. The moderation
 * action is the one with teeth -- see banBusiness below.
 */

function nowIso() {
  return new Date().toISOString();
}

function revalidateAdmin() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/users");
  revalidatePath("/admin/businesses");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/disputes");
}

// --- Reads -------------------------------------------------------------------

export async function getUsers(): Promise<AdminUser[]> {
  return [...adminStore().users].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getBusinesses(): Promise<AdminBusiness[]> {
  return [...adminStore().businesses].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getLeads(): Promise<AdminLead[]> {
  return [...adminStore().leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getLead(id: string): Promise<AdminLead | null> {
  return adminStore().leads.find((l) => l.id === id) ?? null;
}

export async function getComplaints(): Promise<Complaint[]> {
  return [...adminStore().complaints].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getModerationLog(businessId?: string): Promise<ModerationLogEntry[]> {
  const log = adminStore().moderationLog;
  return (businessId ? log.filter((e) => e.businessId === businessId) : log).slice().reverse();
}

// --- Businesses (PRD §12.2) --------------------------------------------------

export interface BusinessInput {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  kind: BusinessKind;
  trade: TradeCategory;
}

export async function createBusiness(
  input: BusinessInput,
): Promise<{ ok: boolean; error?: string }> {
  if (!input.name.trim()) return { ok: false, error: "Business name is required." };
  if (!input.email.includes("@")) return { ok: false, error: "Enter a valid contact email." };

  const store = adminStore();
  if (store.businesses.some((b) => b.email.toLowerCase() === input.email.trim().toLowerCase())) {
    return { ok: false, error: "A business with that email already exists." };
  }

  const business: AdminBusiness = {
    id: `biz-${Date.now().toString(36)}`,
    name: input.name.trim(),
    contactName: input.contactName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    location: input.location.trim(),
    kind: input.kind,
    trade: input.trade,
    tier: "free",
    status: "active",
    // New partners start unverified; an admin verifies them explicitly.
    verifiedAt: null,
    createdAt: nowIso(),
  };
  store.businesses.push(business);

  // A business needs a login identity (PRD §18: creates auth.users + profiles).
  store.users.push({
    id: `usr-${Date.now().toString(36)}`,
    name: business.contactName || business.name,
    email: business.email,
    role: "business",
    status: "active",
    createdAt: nowIso(),
  });

  revalidateAdmin();
  return { ok: true };
}

export async function updateBusiness(
  id: string,
  input: Partial<BusinessInput>,
): Promise<{ ok: boolean; error?: string }> {
  const business = adminStore().businesses.find((b) => b.id === id);
  if (!business) return { ok: false, error: "That business no longer exists." };

  Object.assign(business, {
    name: input.name?.trim() ?? business.name,
    contactName: input.contactName?.trim() ?? business.contactName,
    email: input.email?.trim() ?? business.email,
    phone: input.phone?.trim() ?? business.phone,
    location: input.location?.trim() ?? business.location,
    kind: input.kind ?? business.kind,
    trade: input.trade ?? business.trade,
  });
  revalidateAdmin();
  return { ok: true };
}

/** Soft disable, per PRD §12.2 -- never a delete. */
export async function setBusinessDisabled(
  id: string,
  disabled: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const business = adminStore().businesses.find((b) => b.id === id);
  if (!business) return { ok: false, error: "That business no longer exists." };
  if (business.status === "banned") {
    return { ok: false, error: "A banned business must be unbanned before it can be re-enabled." };
  }
  business.status = disabled ? "disabled" : "active";
  revalidateAdmin();
  return { ok: true };
}

export async function setBusinessVerified(
  id: string,
  verified: boolean,
): Promise<{ ok: boolean; error?: string }> {
  const business = adminStore().businesses.find((b) => b.id === id);
  if (!business) return { ok: false, error: "That business no longer exists." };
  business.verifiedAt = verified ? nowIso() : null;
  revalidateAdmin();
  return { ok: true };
}

// --- Leads (PRD §12.3) -------------------------------------------------------

export async function assignLead(
  leadId: string,
  businessId: string | null,
): Promise<{ ok: boolean; error?: string }> {
  const store = adminStore();
  const lead = store.leads.find((l) => l.id === leadId);
  if (!lead) return { ok: false, error: "That lead no longer exists." };

  if (businessId) {
    const business = store.businesses.find((b) => b.id === businessId);
    if (!business) return { ok: false, error: "Unknown business." };
    if (business.status !== "active") {
      return {
        ok: false,
        error: `${business.name} is ${business.status} and cannot receive leads.`,
      };
    }
  }

  lead.businessId = businessId;
  revalidateAdmin();
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true };
}

export async function setLeadStatus(
  leadId: string,
  status: AdminLead["status"],
): Promise<{ ok: boolean; error?: string }> {
  const lead = adminStore().leads.find((l) => l.id === leadId);
  if (!lead) return { ok: false, error: "That lead no longer exists." };
  lead.status = status;
  revalidateAdmin();
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true };
}

// --- Moderation --------------------------------------------------------------

export async function setComplaintStatus(
  complaintId: string,
  status: ComplaintStatus,
): Promise<{ ok: boolean; error?: string }> {
  const complaint = adminStore().complaints.find((c) => c.id === complaintId);
  if (!complaint) return { ok: false, error: "That complaint no longer exists." };
  complaint.status = status;
  revalidateAdmin();
  return { ok: true };
}

/**
 * Ban a vendor and cascade the consequences.
 *
 * A ban is not a flag -- it has to actually take away what the vendor has:
 *
 *   1. subscription -> canceled with no remaining paid period
 *   2. paid access  -> false, so leads_masked re-hides contact details
 *   3. business      -> status `banned`, and its catalogue archived so the AI
 *                       pipeline stops specifying its products
 *   4. an append-only vendor_moderation_logs entry recording why
 *
 * Step 2 falls out of step 1 by construction: `business_has_paid_access()`
 * reads the subscription row, so there is no separate access flag to forget.
 * Clearing `currentPeriodEnd` is what makes it immediate -- an ordinary
 * cancellation keeps access until the period ends, and a ban must not.
 */
export async function banBusiness(
  businessId: string,
  reason: string,
  complaintId: string | null = null,
  actedBy = "admin@kanso.pk",
): Promise<{ ok: boolean; error?: string }> {
  if (!reason.trim()) {
    return { ok: false, error: "Record a reason -- the ban is written to an audit log." };
  }

  const store = adminStore();
  const business = store.businesses.find((b) => b.id === businessId);
  if (!business) return { ok: false, error: "That business no longer exists." };

  // 1 + 2. Cancel the subscription outright. No remaining paid period, so
  // business_has_paid_access() is false on the very next request.
  const subscription = readSubscription(businessId);
  writeSubscription({
    ...subscription,
    tier: "free",
    status: "canceled",
    currentPeriodEnd: null,
    updatedAt: nowIso(),
  });

  // 3. Status and catalogue.
  business.status = "banned";
  business.tier = "free";
  await archiveProductsForBusiness(businessId);

  // Open complaints against this vendor are now resolved by the ban.
  for (const complaint of store.complaints) {
    if (complaint.businessId === businessId && complaint.status !== "dismissed") {
      complaint.status = "resolved";
    }
  }

  // 4. Audit trail.
  store.moderationLog.push({
    id: `mod-${Date.now().toString(36)}`,
    businessId,
    action: "ban",
    reason: reason.trim(),
    complaintId,
    actedBy,
    createdAt: nowIso(),
  });

  revalidateAdmin();
  revalidatePath("/pro/dashboard");
  revalidatePath("/pro/settings/billing");
  revalidatePath("/pro/inventory");
  return { ok: true };
}

/**
 * Lift a ban. Deliberately does NOT restore the subscription or the catalogue:
 * the vendor re-subscribes and re-lists, so a reversal cannot silently hand
 * back paid access nobody paid for.
 */
export async function unbanBusiness(
  businessId: string,
  reason: string,
  actedBy = "admin@kanso.pk",
): Promise<{ ok: boolean; error?: string }> {
  const store = adminStore();
  const business = store.businesses.find((b) => b.id === businessId);
  if (!business) return { ok: false, error: "That business no longer exists." };
  if (business.status !== "banned") return { ok: false, error: "That business is not banned." };

  business.status = "disabled";
  store.moderationLog.push({
    id: `mod-${Date.now().toString(36)}`,
    businessId,
    action: "unban",
    reason: reason.trim() || "Ban lifted.",
    complaintId: null,
    actedBy,
    createdAt: nowIso(),
  });

  revalidateAdmin();
  return { ok: true };
}
