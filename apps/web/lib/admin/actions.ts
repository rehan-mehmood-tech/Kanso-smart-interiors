"use server";

import { revalidatePath } from "next/cache";
import { serverApiFetch } from "@/lib/api/server-client";
import type { AdminBusiness, AdminLead, AdminUser, BusinessKind, Complaint, ComplaintStatus, ModerationLogEntry, TradeCategory } from "./types";

function refresh() {
  for (const path of ["/admin/dashboard", "/admin/users", "/admin/businesses", "/admin/leads", "/admin/disputes"]) revalidatePath(path);
}
async function mutate(path: string, body: unknown, method = "PATCH") {
  try { await serverApiFetch(path, { method, body: JSON.stringify(body) }); refresh(); return { ok: true }; }
  catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Request failed." }; }
}

export async function getUsers(): Promise<AdminUser[]> { return (await serverApiFetch<{users: AdminUser[]}>("v1/admin/users")).users; }
export async function getBusinesses(): Promise<AdminBusiness[]> { return (await serverApiFetch<{businesses: AdminBusiness[]}>("v1/admin/businesses")).businesses; }
export async function getLeads(): Promise<AdminLead[]> { return (await serverApiFetch<{leads: AdminLead[]}>("v1/admin/leads")).leads; }
export async function getLead(id: string): Promise<AdminLead | null> { try { return (await serverApiFetch<{lead: AdminLead}>(`v1/admin/leads/${id}`)).lead; } catch { return null; } }
export async function getComplaints(): Promise<Complaint[]> { return (await serverApiFetch<{complaints: Complaint[]}>("v1/admin/disputes")).complaints; }
export async function getModerationLog(businessId?: string): Promise<ModerationLogEntry[]> { const q = businessId ? `?business_id=${encodeURIComponent(businessId)}` : ""; return (await serverApiFetch<{entries: ModerationLogEntry[]}>(`v1/admin/moderation-log${q}`)).entries; }

export interface BusinessInput { name: string; contactName: string; email: string; phone: string; location: string; kind: BusinessKind; trade: TradeCategory; }
export async function createBusiness(input: BusinessInput) { return mutate("v1/admin/businesses", { name: input.name, contact_name: input.contactName, email: input.email, phone: input.phone, city: input.location, kind: input.kind, trade: input.trade }, "POST"); }
export async function updateBusiness(id: string, input: Partial<BusinessInput>) { return mutate(`v1/admin/businesses/${id}`, { name: input.name, phone: input.phone, city: input.location, kind: input.kind, trade: input.trade }); }
export async function setBusinessDisabled(id: string, disabled: boolean) { return mutate(`v1/admin/businesses/${id}`, { is_active: !disabled }); }
export async function setBusinessVerified(id: string, verified: boolean) { return mutate(`v1/admin/businesses/${id}`, { verified }); }
export async function assignLead(leadId: string, businessId: string | null) { return mutate(`v1/admin/leads/${leadId}`, businessId ? { business_id: businessId } : { clear_business: true }); }
export async function setLeadStatus(leadId: string, status: AdminLead["status"]) { return mutate(`v1/admin/leads/${leadId}`, { status }); }
export async function setComplaintStatus(id: string, status: ComplaintStatus) { return mutate(`v1/admin/disputes/${id}`, { status: status === "open" ? "reviewing" : status }); }
export async function banBusiness(businessId: string, reason: string, complaintId: string | null = null) { return mutate(`v1/admin/businesses/${businessId}/moderate`, { action: "ban", reason, complaint_id: complaintId }, "POST"); }
export async function unbanBusiness(businessId: string, reason: string) { return mutate(`v1/admin/businesses/${businessId}/moderate`, { action: "unban", reason }, "POST"); }
