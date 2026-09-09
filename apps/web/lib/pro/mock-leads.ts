import { maskAddress, maskEmail, maskPhone, type MaskedLead } from "./leads";

/**
 * Stand-in for `select * from leads_masked`.
 *
 * Rows carry contact values so both gated states can be exercised; the real
 * view returns null for those columns to an unpaid business. When Supabase is
 * connected, replace `getVendorLeads` with the query — the row shape is
 * already the view's shape, so nothing downstream changes.
 */

const HOUR = 60 * 60 * 1000;

function hoursAgo(n: number): string {
  return new Date(Date.now() - n * HOUR).toISOString();
}

type LeadRow = Omit<
  MaskedLead,
  "isUnlocked" | "phonePreview" | "emailPreview" | "addressPreview"
>;

const ROWS: LeadRow[] = [
  {
    id: "lead-1",
    customerName: "Sarah Jenkins",
    city: "Gulberg III, Lahore",
    roomType: "Living Room",
    styleSlug: "japandi",
    status: "new",
    createdAt: hoursAgo(2),
    captureStatus: "4/4 Photos",
    phone: "+92 300 1234567",
    email: "sarah.jenkins@gmail.com",
    fullAddress: "House 42, Street 7, Gulberg III, Lahore",
    message:
      "Access via service elevator. Please bring physical samples for the oak flooring if possible.",
  },
  {
    id: "lead-2",
    customerName: "Michael Chen",
    city: "F-7, Islamabad",
    roomType: "Bedroom",
    styleSlug: "warm_neutral",
    status: "contacted",
    createdAt: hoursAgo(26),
    captureStatus: "4/4 Photos",
    phone: "+92 321 9876543",
    email: "m.chen@outlook.com",
    fullAddress: "Apartment 9B, Silver Oaks, F-7, Islamabad",
    message: "Weekends only for the site visit.",
  },
  {
    id: "lead-3",
    customerName: "Elena Rossi",
    city: "DHA Phase 5, Karachi",
    roomType: "Home Office",
    styleSlug: "minimal",
    status: "completed",
    createdAt: hoursAgo(72),
    captureStatus: "4/4 Photos",
    phone: "+92 333 4567890",
    email: "elena.rossi@studio.pk",
    fullAddress: "Villa 17, Khayaban-e-Shahbaz, DHA Phase 5, Karachi",
    message: null,
  },
  {
    id: "lead-4",
    customerName: "Bilal Ahmed",
    city: "Bahria Town, Rawalpindi",
    roomType: "Dining Room",
    styleSlug: "scandinavian",
    status: "new",
    createdAt: hoursAgo(5),
    captureStatus: "4/4 Photos",
    phone: "+92 345 2223344",
    email: "bilal.ahmed@gmail.com",
    fullAddress: "Plot 88, Sector C, Bahria Town, Rawalpindi",
    message: "Budget is firm. Prefer locally sourced timber.",
  },
];

/** Applies the gate the same way the database view would. */
export function getVendorLeads(hasPaidAccess: boolean): MaskedLead[] {
  return ROWS.map((row) => ({
    ...row,
    isUnlocked: hasPaidAccess,
    // Masked previews are derived here, on the server. When the real view is
    // wired up these come from the database too -- the unmasked value must
    // never cross the network to an unpaid vendor.
    phonePreview: maskPhone(row.phone ?? ""),
    emailPreview: maskEmail(row.email ?? ""),
    addressPreview: maskAddress(row.fullAddress ?? ""),
    phone: hasPaidAccess ? row.phone : null,
    email: hasPaidAccess ? row.email : null,
    fullAddress: hasPaidAccess ? row.fullAddress : null,
    message: hasPaidAccess ? row.message : null,
  }));
}

export function getVendorLead(id: string, hasPaidAccess: boolean): MaskedLead | undefined {
  return getVendorLeads(hasPaidAccess).find((lead) => lead.id === id);
}
