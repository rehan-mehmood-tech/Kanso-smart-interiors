import { DEV_BUSINESS_ID } from "@/lib/pro/subscription-store";
import type {
  AdminBusiness,
  AdminLead,
  AdminUser,
  Complaint,
  ModerationLogEntry,
} from "./types";

/**
 * In-memory stand-in for the admin surfaces, mirroring `profiles`,
 * `businesses`, `consultation_leads`, and the moderation tables.
 *
 * Kept on globalThis so it survives hot reloads, and deliberately separate
 * from the server actions: a "use server" module may only export async
 * functions, and both the actions and the read paths need this state.
 *
 * Per-process, resets on restart. A stand-in, not a database.
 */

const DAY = 24 * 60 * 60 * 1000;

function daysAgo(n: number): string {
  return new Date(Date.now() - n * DAY).toISOString();
}

export interface AdminStore {
  users: AdminUser[];
  businesses: AdminBusiness[];
  leads: AdminLead[];
  complaints: Complaint[];
  moderationLog: ModerationLogEntry[];
}

function seed(): AdminStore {
  const businesses: AdminBusiness[] = [
    {
      id: DEV_BUSINESS_ID,
      name: "Rossi Interiors",
      contactName: "Elena Rossi",
      email: "elena@rossiinteriors.pk",
      phone: "+92 300 4455661",
      location: "Gulberg III, Lahore",
      kind: "shop_with_crew",
      trade: "furniture_store",
      tier: "free",
      status: "active",
      verifiedAt: daysAgo(120),
      createdAt: daysAgo(140),
    },
    {
      id: "biz-2",
      name: "Karim Woodworks",
      contactName: "Karim Butt",
      email: "karim@karimwood.pk",
      phone: "+92 321 7788990",
      location: "Model Town, Lahore",
      kind: "solo_tradesman",
      trade: "carpenter",
      tier: "solo_tradesman",
      status: "active",
      verifiedAt: daysAgo(64),
      createdAt: daysAgo(70),
    },
    {
      id: "biz-3",
      name: "Sethi Electricals",
      contactName: "Imran Sethi",
      email: "imran@sethielec.pk",
      phone: "+92 333 1122334",
      location: "F-7, Islamabad",
      kind: "solo_tradesman",
      trade: "electrician",
      tier: "solo_tradesman",
      status: "active",
      verifiedAt: null,
      createdAt: daysAgo(9),
    },
    {
      id: "biz-4",
      name: "Lumen Lighting House",
      contactName: "Sana Iqbal",
      email: "sana@lumen.pk",
      phone: "+92 345 5566778",
      location: "DHA Phase 5, Karachi",
      kind: "shop_with_crew",
      trade: "lighting",
      tier: "shop_crew",
      status: "active",
      verifiedAt: daysAgo(31),
      createdAt: daysAgo(40),
    },
    {
      id: "biz-5",
      name: "Nawaz Plumbing Co.",
      contactName: "Shahid Nawaz",
      email: "shahid@nawazplumb.pk",
      phone: "+92 302 9988776",
      location: "Bahria Town, Rawalpindi",
      kind: "solo_tradesman",
      trade: "plumber",
      tier: "free",
      status: "disabled",
      verifiedAt: daysAgo(88),
      createdAt: daysAgo(95),
    },
    {
      id: "biz-6",
      name: "Adnan Surface Finishes",
      contactName: "Adnan Rana",
      email: "adnan@surfacefinish.pk",
      phone: "+92 311 2233445",
      location: "Clifton, Karachi",
      kind: "solo_tradesman",
      trade: "painter",
      tier: "solo_tradesman",
      status: "active",
      verifiedAt: daysAgo(22),
      createdAt: daysAgo(26),
    },
  ];

  const users: AdminUser[] = [
    { id: "usr-1", name: "Sarah Jenkins", email: "sarah.jenkins@gmail.com", role: "customer", status: "active", createdAt: daysAgo(3) },
    { id: "usr-2", name: "Michael Chen", email: "m.chen@outlook.com", role: "customer", status: "active", createdAt: daysAgo(26) },
    { id: "usr-3", name: "Bilal Ahmed", email: "bilal.ahmed@gmail.com", role: "customer", status: "active", createdAt: daysAgo(5) },
    { id: "usr-4", name: "Hina Malik", email: "hina.malik@example.com", role: "customer", status: "suspended", createdAt: daysAgo(58) },
    { id: "usr-5", name: "Elena Rossi", email: "elena@rossiinteriors.pk", role: "business", status: "active", createdAt: daysAgo(140) },
    { id: "usr-6", name: "Karim Butt", email: "karim@karimwood.pk", role: "business", status: "active", createdAt: daysAgo(70) },
    { id: "usr-7", name: "Imran Sethi", email: "imran@sethielec.pk", role: "business", status: "active", createdAt: daysAgo(9) },
    { id: "usr-8", name: "Sana Iqbal", email: "sana@lumen.pk", role: "business", status: "active", createdAt: daysAgo(40) },
    { id: "usr-9", name: "Shahid Nawaz", email: "shahid@nawazplumb.pk", role: "business", status: "suspended", createdAt: daysAgo(95) },
    { id: "usr-10", name: "Adnan Rana", email: "adnan@surfacefinish.pk", role: "business", status: "active", createdAt: daysAgo(26) },
    { id: "usr-11", name: "Ayesha Raza", email: "ayesha.raza@example.com", role: "customer", status: "active", createdAt: daysAgo(12) },
    { id: "usr-12", name: "Rehan Mehmood", email: "admin@kanso.pk", role: "admin", status: "active", createdAt: daysAgo(180) },
  ];

  const leads: AdminLead[] = [
    { id: "lead-1", customerName: "Sarah Jenkins", customerPhone: "+92 300 1234567", customerEmail: "sarah.jenkins@gmail.com", city: "Gulberg III, Lahore", roomType: "Living Room", styleSlug: "japandi", status: "new", businessId: null, createdAt: daysAgo(0) },
    { id: "lead-2", customerName: "Michael Chen", customerPhone: "+92 321 9876543", customerEmail: "m.chen@outlook.com", city: "F-7, Islamabad", roomType: "Bedroom", styleSlug: "warm_neutral", status: "contacted", businessId: DEV_BUSINESS_ID, createdAt: daysAgo(1) },
    { id: "lead-3", customerName: "Elena Rossi", customerPhone: "+92 333 4567890", customerEmail: "elena.rossi@studio.pk", city: "DHA Phase 5, Karachi", roomType: "Home Office", styleSlug: "minimal", status: "completed", businessId: "biz-4", createdAt: daysAgo(3) },
    { id: "lead-4", customerName: "Bilal Ahmed", customerPhone: "+92 345 2223344", customerEmail: "bilal.ahmed@gmail.com", city: "Bahria Town, Rawalpindi", roomType: "Dining Room", styleSlug: "scandinavian", status: "new", businessId: null, createdAt: daysAgo(0) },
    { id: "lead-5", customerName: "Hina Malik", customerPhone: "+92 300 7654321", customerEmail: "hina.malik@example.com", city: "Model Town, Lahore", roomType: "Kids Room", styleSlug: "modern", status: "contacted", businessId: "biz-2", createdAt: daysAgo(6) },
    { id: "lead-6", customerName: "Omar Siddiqui", customerPhone: "+92 311 5544332", customerEmail: "omar.s@example.com", city: "Clifton, Karachi", roomType: "Living Room", styleSlug: "luxury", status: "completed", businessId: "biz-6", createdAt: daysAgo(14) },
    { id: "lead-7", customerName: "Zara Khan", customerPhone: "+92 302 8877665", customerEmail: "zara.khan@example.com", city: "G-11, Islamabad", roomType: "Bedroom", styleSlug: "grey", status: "new", businessId: null, createdAt: daysAgo(2) },
    { id: "lead-8", customerName: "Usman Farooq", customerPhone: "+92 335 4433221", customerEmail: "usman.f@example.com", city: "Gulberg III, Lahore", roomType: "Home Office", styleSlug: "industrial", status: "contacted", businessId: "biz-3", createdAt: daysAgo(8) },
    { id: "lead-9", customerName: "Ayesha Raza", customerPhone: "+92 300 1198877", customerEmail: "ayesha.raza@example.com", city: "Johar Town, Lahore", roomType: "Dining Room", styleSlug: "warm_neutral", status: "new", businessId: null, createdAt: daysAgo(4) },
    { id: "lead-10", customerName: "Kamran Baig", customerPhone: "+92 321 6655443", customerEmail: "kamran.b@example.com", city: "F-10, Islamabad", roomType: "Living Room", styleSlug: "scandinavian", status: "completed", businessId: DEV_BUSINESS_ID, createdAt: daysAgo(19) },
    { id: "lead-11", customerName: "Nadia Hussain", customerPhone: "+92 345 7766554", customerEmail: "nadia.h@example.com", city: "DHA Phase 6, Karachi", roomType: "Kids Room", styleSlug: "minimal", status: "new", businessId: null, createdAt: daysAgo(1) },
    { id: "lead-12", customerName: "Tariq Shah", customerPhone: "+92 333 2211009", customerEmail: "tariq.shah@example.com", city: "Askari 11, Lahore", roomType: "Bedroom", styleSlug: "japandi", status: "contacted", businessId: "biz-4", createdAt: daysAgo(11) },
  ];

  const complaints: Complaint[] = [
    {
      id: "cmp-1",
      businessId: "biz-3",
      businessName: "Sethi Electricals",
      customerName: "Usman Farooq",
      leadId: "lead-8",
      reason: "no_show",
      notes:
        "Booked a site visit for Saturday morning. Nobody arrived and no call to reschedule. Second time this has happened.",
      status: "open",
      createdAt: daysAgo(2),
    },
    {
      id: "cmp-2",
      businessId: "biz-3",
      businessName: "Sethi Electricals",
      customerName: "Zara Khan",
      leadId: null,
      reason: "unprofessional",
      notes:
        "Was dismissive about the agreed scope and argued about the quoted price on the phone.",
      status: "open",
      createdAt: daysAgo(5),
    },
    {
      id: "cmp-3",
      businessId: "biz-2",
      businessName: "Karim Woodworks",
      customerName: "Hina Malik",
      leadId: "lead-5",
      reason: "poor_service",
      notes: "Finish on the joinery did not match the approved sample.",
      status: "reviewing",
      createdAt: daysAgo(7),
    },
    {
      id: "cmp-4",
      businessId: "biz-6",
      businessName: "Adnan Surface Finishes",
      customerName: "Omar Siddiqui",
      leadId: "lead-6",
      reason: "overcharged",
      notes: "Final invoice was above the price-locked scope document by a wide margin.",
      status: "open",
      createdAt: daysAgo(3),
    },
    {
      id: "cmp-5",
      businessId: "biz-4",
      businessName: "Lumen Lighting House",
      customerName: "Tariq Shah",
      leadId: "lead-12",
      reason: "poor_service",
      notes: "Fittings delivered damaged; replacement took three weeks.",
      status: "resolved",
      createdAt: daysAgo(21),
    },
  ];

  return { users, businesses, leads, complaints, moderationLog: [] };
}

export function adminStore(): AdminStore {
  const g = globalThis as typeof globalThis & { __kansoAdmin?: AdminStore };
  if (!g.__kansoAdmin) g.__kansoAdmin = seed();
  return g.__kansoAdmin;
}

export function businessName(id: string | null): string | null {
  if (!id) return null;
  return adminStore().businesses.find((b) => b.id === id)?.name ?? null;
}
