/**
 * Vendor-facing lead types and presentation helpers.
 *
 * The shape mirrors the `leads_masked` view from
 * supabase/migrations/20260909_vendor_portal_core.sql, so swapping the mock
 * source for a real query is a change of data origin, not of types.
 *
 * The masking helpers below are PRESENTATION ONLY. Real protection happens in
 * Postgres: for an unpaid business the view returns NULL, so the value never
 * reaches the browser. These functions exist to render a plausible shape for a
 * value the client legitimately holds, never to hide one it shouldn't.
 */

/** PRD §15.10 vocabulary. These are the only three statuses that exist. */
export type LeadStatus = "new" | "contacted" | "completed";

export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "completed"];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  completed: "Completed",
};

export type LeadFilter = "all" | LeadStatus;

export const LEAD_FILTERS: { value: LeadFilter; label: string }[] = [
  { value: "all", label: "All Leads" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "completed", label: "Completed" },
];

/** One row of `leads_masked`. Gated fields are null when `isUnlocked` is false. */
export interface MaskedLead {
  id: string;
  customerName: string;
  city: string;
  roomType: string;
  styleSlug: string;
  status: LeadStatus;
  createdAt: string;
  captureStatus: string;
  /** True when the business holds an active paid subscription. */
  isUnlocked: boolean;
  /** Present only when isUnlocked. Null otherwise -- never sent to the client. */
  phone: string | null;
  email: string | null;
  fullAddress: string | null;
  message: string | null;
  /**
   * Masked previews, computed on the server from values the client never
   * receives. Safe to send in either state: they carry shape, not content.
   */
  phonePreview: string;
  emailPreview: string;
  addressPreview: string;
}

/**
 * "Sarah Jenkins" -> "Sarah J." Surnames are withheld from the list view for
 * every account, paid or not: the list is a browsing surface, and the full
 * identity belongs on the detail screen.
 */
export function toDisplayName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Unknown";
  if (parts.length === 1) return parts[0];
  const last = parts[parts.length - 1];
  return `${parts[0]} ${last.charAt(0).toUpperCase()}.`;
}

const DOT = "•";

/** "+92 300 1234567" -> "+92 300 " + dots + last 3 digits. */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 5) return DOT.repeat(6);
  const head = phone.slice(0, Math.min(8, phone.length - 3));
  const tail = digits.slice(-3);
  return `${head}${DOT.repeat(4)}${tail}`;
}

/** "sarah.jenkins@gmail.com" -> "s" + dots + "@gmail.com". */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return DOT.repeat(6);
  return `${local.charAt(0)}${DOT.repeat(4)}@${domain}`;
}

/**
 * Keeps only the neighbourhood and city, which the vendor already sees in the
 * list view. House number and street line are dropped -- those are the parts
 * that let someone turn up at the door unpaid.
 */
export function maskAddress(address: string): string {
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  const area = parts.length > 2 ? parts.slice(-2).join(", ") : parts[parts.length - 1] ?? "";
  return `${DOT.repeat(6)}, ${area}`;
}

/** Relative submission time, e.g. "2h ago". Leads are read within hours. */
export function formatSubmittedAt(iso: string, now: Date = new Date()): string {
  const then = new Date(iso);
  const minutes = Math.floor((now.getTime() - then.getTime()) / 60000);
  if (Number.isNaN(minutes)) return "Unknown";
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return then.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
