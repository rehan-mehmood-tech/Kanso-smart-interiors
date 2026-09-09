"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  AlertCircle,
  Loader2,
  Ban,
  ShieldOff,
  CreditCard,
  PackageX,
  ScrollText,
  MessageSquareWarning,
} from 'lucide-react';
import { StatusPill } from './StatusPill';
import {
  COMPLAINT_LABELS,
  COMPLAINT_STATUS_LABELS,
  TRADE_LABELS,
  type AdminBusiness,
  type Complaint,
  type ModerationLogEntry,
} from '@/lib/admin/types';

type Result = { ok: boolean; error?: string };

interface VendorModerationModalProps {
  business: AdminBusiness;
  complaints: Complaint[];
  history: ModerationLogEntry[];
  onClose: () => void;
  banAction: (businessId: string, reason: string, complaintId: string | null) => Promise<Result>;
  dismissAction: (complaintId: string) => Promise<Result>;
}

/** What a ban actually does, stated to the admin before they do it. */
const BAN_CONSEQUENCES = [
  { icon: CreditCard, text: 'Cancels the subscription immediately, with no remaining paid period' },
  { icon: ShieldOff, text: 'Revokes lead access — customer contact details re-mask at once' },
  { icon: PackageX, text: 'Sets the business to banned and archives its entire catalogue' },
  { icon: ScrollText, text: 'Writes an entry to the moderation audit log' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function VendorModerationModal({
  business,
  complaints,
  history,
  onClose,
  banAction,
  dismissAction,
}: VendorModerationModalProps) {
  const [reason, setReason] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const alreadyBanned = business.status === 'banned';

  const handleBan = async () => {
    if (reason.trim().length < 10) {
      setError('Write at least a sentence — this reason is the audit record.');
      return;
    }
    setBusy(true);
    setError(null);
    const openest = complaints.find((c) => c.status === 'open' || c.status === 'reviewing');
    const result = await banAction(business.id, reason.trim(), openest?.id ?? null);
    if (!result.ok) {
      setError(result.error ?? 'That ban could not be applied.');
      setBusy(false);
      return;
    }
    setBusy(false);
    onClose();
  };

  const handleDismiss = async (complaintId: string) => {
    setBusy(true);
    setError(null);
    const result = await dismissAction(complaintId);
    if (!result.ok) setError(result.error ?? 'Could not dismiss that complaint.');
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      <button
        type="button"
        aria-label="Close moderation drawer"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-[#1b1c19]/50 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="moderation-title"
        className="relative flex h-full w-full max-w-[36rem] flex-col overflow-y-auto border-l border-[#c4c7c7] bg-[#fbf9f4] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#c4c7c7] p-6">
          <div className="min-w-0">
            <span className="font-body text-[10px] tracking-[0.18em] text-[#1b1c19]/45 uppercase">
              Vendor Moderation
            </span>
            <h2 id="moderation-title" className="mt-2 font-serif text-2xl leading-tight text-[#1b1c19]">
              {business.name}
            </h2>
            <p className="mt-1.5 font-body text-sm text-[#1b1c19]/60">
              {TRADE_LABELS[business.trade]} &middot; {business.location}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusPill
                label={business.status}
                tone={
                  business.status === 'active'
                    ? 'positive'
                    : business.status === 'banned'
                      ? 'critical'
                      : 'neutral'
                }
              />
              <StatusPill
                label={business.verifiedAt ? 'Verified' : 'Unverified'}
                tone={business.verifiedAt ? 'positive' : 'warning'}
              />
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#c4c7c7] text-[#1b1c19] transition-colors hover:bg-[#f4f0ea]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-8 p-6">
          {/* Complaint history */}
          <section>
            <h3 className="mb-4 font-serif text-lg leading-tight text-[#1b1c19]">
              Complaint history
              <span className="ml-2 font-body text-sm text-[#1b1c19]/50 tabular-nums">
                {complaints.length}
              </span>
            </h3>

            {complaints.length === 0 ? (
              <p className="font-body text-sm text-[#1b1c19]/55">
                No complaints recorded against this vendor.
              </p>
            ) : (
              <ul className="flex flex-col gap-4">
                {complaints.map((c) => (
                  <li key={c.id} className="rounded-xl border border-[#c4c7c7] bg-[#f4f0ea] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-2 font-body-md text-sm font-medium text-[#1b1c19]">
                        <MessageSquareWarning className="h-4 w-4 shrink-0 text-[#92651a]" />
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
                    </div>
                    <p className="mt-3 font-body text-sm leading-relaxed text-[#1b1c19]/75">
                      &ldquo;{c.notes}&rdquo;
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <span className="font-body text-xs text-[#1b1c19]/50">
                        {c.customerName} &middot; {formatDate(c.createdAt)}
                      </span>
                      {(c.status === 'open' || c.status === 'reviewing') && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleDismiss(c.id)}
                          className="font-label-sm text-[10px] tracking-widest text-[#1b1c19]/60 uppercase underline-offset-4 transition-colors hover:text-[#1b1c19] hover:underline disabled:opacity-50"
                        >
                          Dismiss complaint
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Moderation history */}
          {history.length > 0 && (
            <section>
              <h3 className="mb-3 font-serif text-lg leading-tight text-[#1b1c19]">
                Moderation log
              </h3>
              <ul className="flex flex-col gap-3">
                {history.map((entry) => (
                  <li key={entry.id} className="border-l-2 border-[#9d3f30] pl-4">
                    <p className="font-body-md text-sm font-medium text-[#1b1c19] capitalize">
                      {entry.action.replace(/_/g, ' ')}
                    </p>
                    <p className="mt-1 font-body text-sm text-[#1b1c19]/70">{entry.reason}</p>
                    <p className="mt-1 font-body text-xs text-[#1b1c19]/45">
                      {entry.actedBy} &middot; {formatDate(entry.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Ban action */}
          <section className="mt-auto rounded-xl border border-[#9d3f30]/30 bg-[#9d3f30]/[0.04] p-5">
            <h3 className="flex items-center gap-2 font-serif text-lg leading-tight text-[#1b1c19]">
              <Ban className="h-4 w-4 shrink-0 text-[#9d3f30]" />
              {alreadyBanned ? 'Vendor is banned' : 'Ban & cancel subscription'}
            </h3>

            {alreadyBanned ? (
              <p className="mt-3 font-body text-sm leading-relaxed text-[#1b1c19]/70">
                This vendor is already banned. Their subscription is cancelled, lead
                access is revoked and their catalogue is archived.
              </p>
            ) : (
              <>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {BAN_CONSEQUENCES.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex gap-2.5">
                      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9d3f30]" />
                      <span className="font-body text-xs leading-relaxed text-[#1b1c19]/75">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5">
                  <label
                    htmlFor="ban-reason"
                    className="mb-2 block font-body text-sm font-medium text-[#1b1c19]"
                  >
                    Reason for the ban
                  </label>
                  <textarea
                    id="ban-reason"
                    rows={3}
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      setError(null);
                    }}
                    placeholder="Repeated no-shows against confirmed bookings, two upheld complaints."
                    className="w-full resize-none rounded-2xl border border-[#c4c7c7] bg-[#fbf9f4] px-4 py-3 font-body text-sm text-[#1b1c19] outline-none transition-colors placeholder:text-[#1b1c19]/40 focus:border-[#1b1c19] focus:ring-1 focus:ring-[#1b1c19]"
                  />
                </div>

                {error && (
                  <p role="alert" className="mt-3 flex items-start gap-2 font-body text-sm text-[#9d3f30]">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {error}
                  </p>
                )}

                {!confirming ? (
                  <button
                    type="button"
                    onClick={() => setConfirming(true)}
                    className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-[#9d3f30] px-6 py-3 font-body text-sm font-medium text-[#fbf9f4] transition-colors hover:bg-[#8a3529]"
                  >
                    <Ban className="h-4 w-4 shrink-0" />
                    Ban &amp; Cancel Subscription
                  </button>
                ) : (
                  <div className="mt-5 flex flex-col gap-3">
                    <p className="font-body text-sm leading-relaxed text-[#1b1c19]">
                      This takes effect immediately and cannot be undone by re-enabling
                      the account. Continue?
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setConfirming(false)}
                        className="min-h-[44px] flex-1 rounded-2xl border border-[#c4c7c7] px-6 py-3 font-body text-sm font-medium text-[#1b1c19] transition-colors hover:bg-[#f4f0ea]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={handleBan}
                        className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#9d3f30] px-6 py-3 font-body text-sm font-medium text-[#fbf9f4] transition-colors hover:bg-[#8a3529] disabled:cursor-wait disabled:opacity-80"
                      >
                        {busy && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
                        Confirm Ban
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
