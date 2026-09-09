import React from 'react';
import { LEAD_STATUS_LABELS, type LeadStatus } from '@/lib/pro/leads';

/**
 * Status pill. Weight carries the meaning: an uncontacted lead is the loudest
 * thing on the row, a completed one is the quietest.
 */
const STYLES: Record<LeadStatus, string> = {
  new: 'bg-primary text-on-primary border border-primary',
  contacted: 'bg-[#EAE8E3] text-on-surface border border-outline-variant/50',
  completed: 'bg-[#FBF9F4] text-secondary border border-outline-variant/40',
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`px-2 py-1 font-label-sm text-[10px] uppercase tracking-wider rounded ${STYLES[status]}`}
    >
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
}
