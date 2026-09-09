"use client";

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  Lock,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { SubscriptionUpgradeModal } from './SubscriptionUpgradeModal';
import type { MaskedLead } from '@/lib/pro/leads';

export interface CustomerContactInfo {
  name: string;
  schedule: string;
}

interface CustomerContactCardProps {
  info: CustomerContactInfo;
  /**
   * The lead as returned by `leads_masked`. When `isUnlocked` is false the
   * contact fields are already null -- the component renders the masked
   * previews instead, which the server derived.
   */
  lead: MaskedLead;
  /** Records the unlock in the `unlocked_at` ledger. */
  onUnlockView?: () => void;
}

/** Strips everything but digits for a wa.me link. */
function toWhatsAppNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function CustomerContactCard({ info, lead, onUnlockView }: CustomerContactCardProps) {
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const unlocked = lead.isUnlocked;

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] h-full">
      <div className="flex items-center justify-between mb-6 border-b border-outline-variant/30 pb-4">
        <h2 className="font-display-xl text-xl text-primary tracking-tight">Client Contact</h2>
        {unlocked ? (
          <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-200 shadow-sm">
            <CheckCircle className="w-3 h-3" />
            <span className="font-label-sm text-[10px] uppercase tracking-widest">Unlocked</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-secondary bg-[#F4F2ED] px-2.5 py-1 rounded border border-outline-variant/40">
            <Lock className="w-3 h-3" />
            <span className="font-label-sm text-[10px] uppercase tracking-widest">Locked</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EAE8E3] border border-outline-variant/30 flex items-center justify-center shrink-0">
            <span className="font-display-xl text-lg text-primary leading-none mt-1">
              {info.name.charAt(0)}
            </span>
          </div>
          <span className="font-body-md text-lg text-primary font-medium tracking-tight">
            {info.name}
          </span>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          {/* Phone */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-secondary min-w-0">
              <Phone className="w-4 h-4 shrink-0" />
              <span
                className={`font-body-md text-sm truncate ${unlocked ? '' : 'select-none tracking-wide'}`}
              >
                {unlocked ? lead.phone : lead.phonePreview}
              </span>
            </div>
            {unlocked && lead.phone && (
              <div className="flex gap-2 shrink-0">
                <a
                  href={`tel:${lead.phone.replace(/\s/g, '')}`}
                  className="font-label-sm text-[10px] uppercase tracking-widest text-primary border border-outline-variant/50 px-3 py-1.5 rounded hover:bg-[#F4F2ED] transition-colors shadow-sm"
                >
                  Call
                </a>
                <a
                  href={`https://wa.me/${toWhatsAppNumber(lead.phone)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-label-sm text-[10px] uppercase tracking-widest text-on-primary bg-primary px-3 py-1.5 rounded hover:bg-surface-tint transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3 h-3" />
                  WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 text-secondary min-w-0">
            <Mail className="w-4 h-4 shrink-0" />
            {unlocked && lead.email ? (
              <a
                href={`mailto:${lead.email}`}
                className="font-body-md text-sm truncate hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                {lead.email}
              </a>
            ) : (
              <span className="font-body-md text-sm truncate select-none tracking-wide">
                {lead.emailPreview}
              </span>
            )}
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 text-secondary min-w-0">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            <span
              className={`font-body-md text-sm ${unlocked ? '' : 'select-none tracking-wide'}`}
            >
              {unlocked ? lead.fullAddress : lead.addressPreview}
            </span>
          </div>

          {/* Preferred time is never gated: it is scheduling, not identity. */}
          <div className="flex items-center gap-3 text-secondary">
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="font-body-md text-sm text-primary font-medium">{info.schedule}</span>
          </div>
        </div>

        {unlocked && lead.message && (
          <div className="mt-6 pt-4 border-t border-outline-variant/30">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary block mb-2">
              Special Requirements
            </span>
            <p className="font-body-md text-sm text-primary italic leading-relaxed bg-[#F4F2ED]/50 p-4 rounded-lg border border-outline-variant/20">
              &ldquo;{lead.message}&rdquo;
            </p>
          </div>
        )}

        {/* Upgrade prompt — only for an unpaid vendor. */}
        {!unlocked && (
          <div className="mt-6 rounded-xl border border-[#1b1c19]/15 bg-[#1b1c19] p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-[#fbf9f4]" />
              <span className="font-label-sm text-[10px] uppercase tracking-widest text-[#fbf9f4]/70">
                Kanso Pro
              </span>
            </div>
            <p className="mt-3 font-body-md text-sm leading-relaxed text-[#fbf9f4]/85">
              Upgrade to Solo Tradesman or Shop Tier to unlock direct WhatsApp
              &amp; Call access for this lead.
            </p>
            <button
              type="button"
              onClick={() => {
                onUnlockView?.();
                setUpgradeOpen(true);
              }}
              className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#fbf9f4] px-4 py-2.5 font-label-sm text-xs uppercase tracking-widest text-[#1b1c19] transition-colors hover:bg-white"
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              Unlock Lead Details
            </button>
          </div>
        )}
      </div>

      <SubscriptionUpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
