"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Records the first time a paying business revealed a lead's contact details.
 *
 * Append-only: an unlock is never cleared, so a later billing dispute has an
 * audit trail. Writes only when the ledger is still empty for this lead.
 */
export async function recordLeadUnlock(leadId: string, businessId: string): Promise<void> {
  const supabase = await createClient();
  if (!supabase) return; // No project configured yet; nothing to record.

  await supabase
    .from("consultation_leads")
    .update({
      unlocked_by_business_id: businessId,
      unlocked_at: new Date().toISOString(),
    })
    .eq("id", leadId)
    .is("unlocked_at", null);
}
