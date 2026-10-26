import "server-only";
import { serverApiFetch } from "@/lib/api/server-client";
import type { MaskedLead } from "./leads";

export async function getVendorLeads(): Promise<MaskedLead[]> {
  return (await serverApiFetch<{ leads: MaskedLead[] }>("v1/business/leads")).leads;
}

export async function getVendorLead(id: string): Promise<MaskedLead | undefined> {
  try {
    return (await serverApiFetch<{ lead: MaskedLead }>(`v1/business/leads/${id}`)).lead;
  } catch {
    return undefined;
  }
}
