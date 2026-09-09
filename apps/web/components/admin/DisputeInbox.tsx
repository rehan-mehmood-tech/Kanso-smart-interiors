"use client";

import React, { useMemo, useState } from 'react';
import { MessageSquareWarning, ShieldAlert, ArrowRight } from 'lucide-react';
import { StatusPill } from './StatusPill';
import { VendorModerationModal } from './VendorModerationModal';
import {
  COMPLAINT_LABELS,
  COMPLAINT_STATUS_LABELS,
  TRADE_LABELS,
  type AdminBusiness,
  type Complaint,
  type ComplaintStatus,
  type ModerationLogEntry,
} from '@/lib/admin/types';

type Result = { ok: boolean; error?: string };
type Filter = 'open' | 'resolved' | 'all';

interface DisputeInboxProps {
  complaints: Complaint[];
  businesses: AdminBusiness[];
  moderationLog: ModerationLogEntry[];
  banAction: (businessId: string, reason: string, complaintId: string | null) => Promise<Result>;
  setStatusAction: (complaintId: string, status: ComplaintStatus) => Promise<Result>;
}

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'open', label: 'Needs Review' },
  { value: 'resolved', label: 'Closed' },
  { value: 'all', label: 'All' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function DisputeInbox({
  complaints,
  businesses,
  moderationLog,
  banAction,
  setStatusAction,
}: DisputeInboxProps) {
  const [filter, setFilter] = useState<Filter>('open');
  const [moderating, setModerating] = useState<AdminBusiness | null>(null);

  const counts = useMemo<Record<Filter, number>>(
    () => ({
      open: complaints.filter((c) => c.status === 'open' || c.status === 'reviewing').length,
      resolved: complaints.filter((c) => c.status === 'resolved' || c.status === 'dismissed')
        .length,
      all: complaints.length,
    }),
    [complaints],
  );

  const visible = useMemo(() => {
    if (filter === 'all') return complaints;
    if (filter === 'open') {
      return complaints.filter((c) => c.status === 'open' || c.status === 'reviewing');
    }
    return complaints.filter((c) => c.status === 'resolved' || c.status === 'dismissed');
  }, [complaints, filter]);

  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Filter complaints"
      >
        {FILTERS.map(({ value, label }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(value)}
              className={`min-h-[36px] rounded-full border px-4 py-1.5 font-body text-xs whitespace-nowrap transition-colors duration-200 ${
                active
                  ? 'border-[#1b1c19] bg-[#1b1c19] text-[#fbf9f4]'
                  : 'border-[#c4c7c7] bg-[#fbf9f4] text-[#1b1c19]/70 hover:border-[#1b1c19] hover:text-[#1b1c19]'
              }`}
            >
              {label}
              <span className={active ? 'ml-2 opacity-70' : 'ml-2 opacity-55'}>
                {counts[value]}
              </span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#c4c7c7] bg-[#f4f0ea] px-6 py-16 text-center">
          <ShieldAlert className="mx-auto mb-3 h-6 w-6 text-[#1b1c19]/40" />
          <p className="font-serif text-lg text-[#1b1c19]">Nothing to review</p>
          <p className="mt-2 font-body text-sm text-[#1b1c19]/60">No complaints in this view.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {visible.map((c) => {
            const business = businesses.find((b) => b.id === c.businessId);
            return (
              <li key={c.id} className="rounded-xl border border-[#c4c7c7] bg-[#fbf9f4] p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <MessageSquareWarning className="h-4 w-4 shrink-0 text-[#92651a]" />
                      <span className="font-body-md text-sm font-semibold text-[#1b1c19]">
                        {COMPLAINT_LABELS[c.reason]}
                      </span>
                      <StatusPill
                        label={COMPLAINT_STATUS_LABELS[c.status]}
                        tone={
                          c.status === 'open'
                            ? 'critical'
                            : c.status === 'reviewing'
                              ? 'warning'
                              : 'neutral'
                        }
                      />
                      {business?.status === 'banned' && (
                        <StatusPill label="Vendor Banned" tone="critical" />
                      )}
                    </div>

                    <p className="mt-3 max-w-[52rem] font-body text-sm leading-relaxed text-[#1b1c19]/75">
                      &ldquo;{c.notes}&rdquo;
                    </p>

                    <p className="mt-3 font-body text-xs text-[#1b1c19]/55">
                      <span className="font-medium text-[#1b1c19]/70">{c.businessName}</span>
                      {business ? <> &middot; {TRADE_LABELS[business.trade]}</> : null} &middot;
                      reported by {c.customerName} &middot; {formatDate(c.createdAt)}
                    </p>
                  </div>

                  {business && (
                    <button
                      type="button"
                      onClick={() => setModerating(business)}
                      className="group inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-2xl border border-[#c4c7c7] px-5 py-2.5 font-body text-sm font-medium text-[#1b1c19] transition-colors hover:border-[#9d3f30] hover:text-[#9d3f30]"
                    >
                      Review Vendor
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {moderating && (
        <VendorModerationModal
          business={moderating}
          complaints={complaints.filter((c) => c.businessId === moderating.id)}
          history={moderationLog.filter((e) => e.businessId === moderating.id)}
          onClose={() => setModerating(null)}
          banAction={banAction}
          dismissAction={(complaintId) => setStatusAction(complaintId, 'dismissed')}
        />
      )}
    </div>
  );
}
