import type { TierId } from "@/lib/pro/tiers";

/** PRD §15.1 profiles.role */
export type UserRole = "customer" | "business" | "admin";

/** PRD §15.1 profiles.status, plus the suspended state the admin panel needs. */
export type AccountStatus = "active" | "suspended";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
}

/** business_kind from the vendor-portal migration. */
export type BusinessKind = "solo_tradesman" | "shop_with_crew";

/** trade_category from the vendor-portal migration. */
export type TradeCategory =
  | "furniture_store"
  | "carpenter"
  | "plumber"
  | "electrician"
  | "painter"
  | "joiner"
  | "lighting"
  | "flooring"
  | "other";

export const TRADE_LABELS: Record<TradeCategory, string> = {
  furniture_store: "Furniture Store",
  carpenter: "Carpenter",
  plumber: "Plumber",
  electrician: "Electrician",
  painter: "Painter",
  joiner: "Joiner",
  lighting: "Lighting",
  flooring: "Flooring",
  other: "Other",
};

export const TRADE_OPTIONS = Object.entries(TRADE_LABELS).map(([id, label]) => ({
  id: id as TradeCategory,
  label,
}));

/**
 * `banned` is added by the moderation migration. It is distinct from
 * `disabled`: disabled is administrative housekeeping, banned is a sanction
 * and carries a moderation log entry explaining it.
 */
export type BusinessStatus = "active" | "disabled" | "banned";

export const BUSINESS_STATUS_LABELS: Record<BusinessStatus, string> = {
  active: "Active",
  disabled: "Disabled",
  banned: "Banned",
};

export interface AdminBusiness {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  kind: BusinessKind;
  trade: TradeCategory;
  tier: TierId;
  status: BusinessStatus;
  /** Null until an admin verifies the business. */
  verifiedAt: string | null;
  createdAt: string;
}

export type AdminLeadStatus = "new" | "contacted" | "completed";
export type AdminLeadFilter = "all" | "unassigned" | "assigned" | "completed";

export interface AdminLead {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  city: string;
  roomType: string;
  styleSlug: string;
  status: AdminLeadStatus;
  /** Null means the lead is sitting in the unassigned admin queue (PRD §25.1). */
  businessId: string | null;
  createdAt: string;
}

export type ComplaintReason =
  | "poor_service"
  | "no_show"
  | "unprofessional"
  | "overcharged"
  | "other";

export const COMPLAINT_LABELS: Record<ComplaintReason, string> = {
  poor_service: "Poor Service",
  no_show: "No Show",
  unprofessional: "Unprofessional Behavior",
  overcharged: "Overcharged",
  other: "Other",
};

export type ComplaintStatus = "open" | "reviewing" | "resolved" | "dismissed";

export const COMPLAINT_STATUS_LABELS: Record<ComplaintStatus, string> = {
  open: "Open",
  reviewing: "Reviewing",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

export interface Complaint {
  id: string;
  businessId: string;
  businessName: string;
  customerName: string;
  leadId: string | null;
  reason: ComplaintReason;
  notes: string;
  status: ComplaintStatus;
  createdAt: string;
}

/** One row of `vendor_moderation_logs`. Append-only. */
export interface ModerationLogEntry {
  id: string;
  businessId: string;
  action: "ban" | "unban" | "warn" | "dismiss_complaint";
  reason: string;
  complaintId: string | null;
  actedBy: string;
  createdAt: string;
}
