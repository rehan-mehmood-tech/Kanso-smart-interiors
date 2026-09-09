"use client";

import React, { useState, useTransition } from 'react';
import { AlertCircle, Loader2, UserCheck, Undo2 } from 'lucide-react';
import { StatusPill } from './StatusPill';
import { TRADE_LABELS, type AdminBusiness, type AdminLead } from '@/lib/admin/types';

interface LeadAssignmentPanelProps {
  lead: AdminLead;
  businesses: AdminBusiness[];
  assignAction: (leadId: string, businessId: string | null) => Promise<{ ok: boolean; error?: string }>;
}

/**
 * Manual assignment override (PRD §12.3).
 *
 * Only active businesses appear: a disabled or banned vendor must not be
 * routable, and the server rejects it anyway -- the filter here just avoids
 * offering a choice that will fail.
 */
export function LeadAssignmentPanel({ lead, businesses, assignAction }: LeadAssignmentPanelProps) {
  const [selected, setSelected] = useState<string>(lead.businessId ?? '');
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const assignable = businesses.filter((b) => b.status === 'active');
  const current = businesses.find((b) => b.id === lead.businessId) ?? null;

  const submit = (businessId: string | null) => {
    setNotice(null);
    startTransition(async () => {
      const result = await assignAction(lead.id, businessId);
      if (!result.ok) setNotice(result.error ?? 'Could not update the assignment.');
    });
  };

  return (
    <section className="rounded-xl border border-[#c4c7c7] bg-[#fbf9f4] p-6">
      <h2 className="font-serif text-lg leading-tight text-[#1b1c19]">Assignment</h2>

      <div className="mt-4 flex items-center gap-2">
        {current ? (
          <>
            <StatusPill label="Assigned" tone="positive" />
            <span className="font-body text-sm text-[#1b1c19]/75">{current.name}</span>
          </>
        ) : (
          <>
            <StatusPill label="Unassigned" tone="critical" />
            <span className="font-body text-sm text-[#1b1c19]/60">In the admin queue</span>
          </>
        )}
      </div>

      <div className="mt-6">
        <label
          htmlFor="assign-business"
          className="mb-2 block font-body text-sm font-medium text-[#1b1c19]"
        >
          {current ? 'Reassign to' : 'Assign to'}
        </label>
        <select
          id="assign-business"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full min-h-[44px] cursor-pointer rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea] px-4 py-3 font-body text-sm text-[#1b1c19] outline-none transition-colors focus:border-[#1b1c19] focus:ring-1 focus:ring-[#1b1c19]"
        >
          <option value="">Select a vendor</option>
          {assignable.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} — {TRADE_LABELS[b.trade]}
              {b.verifiedAt ? '' : ' (unverified)'}
            </option>
          ))}
        </select>
      </div>

      {notice && (
        <p role="alert" className="mt-4 flex items-start gap-2 font-body text-sm text-[#9d3f30]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {notice}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          disabled={pending || !selected || selected === lead.businessId}
          onClick={() => submit(selected)}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1b1c19] px-6 py-3 font-body text-sm font-medium text-[#fbf9f4] transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-45"
        >
          {pending ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          ) : (
            <UserCheck className="h-4 w-4 shrink-0" />
          )}
          {current ? 'Reassign Lead' : 'Assign Lead'}
        </button>

        {current && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setSelected('');
              submit(null);
            }}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border border-[#c4c7c7] px-6 py-3 font-body text-sm font-medium text-[#1b1c19] transition-colors hover:bg-[#f4f0ea] disabled:opacity-60"
          >
            <Undo2 className="h-4 w-4 shrink-0" />
            Return to Admin Queue
          </button>
        )}
      </div>

      <p className="mt-5 font-body text-xs leading-relaxed text-[#1b1c19]/45">
        Only active vendors can receive leads. Disabled and banned businesses are
        withheld from this list and rejected server-side.
      </p>
    </section>
  );
}
