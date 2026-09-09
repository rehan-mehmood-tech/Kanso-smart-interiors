"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Check, Hammer, Store, ArrowRight } from 'lucide-react';

interface SubscriptionUpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

const PLANS = [
  {
    id: 'solo_tradesman',
    name: 'Solo Tradesman',
    price: 'Rs 1,200',
    icon: Hammer,
    points: ['Single seat', 'Local lead feed', 'Full contact details'],
  },
  {
    id: 'shop_crew',
    name: 'Shop + Crew',
    price: 'Rs 4,800',
    icon: Store,
    points: ['Up to 8 seats', 'Product inventory', 'Priority AI mapping'],
  },
];

export function SubscriptionUpgradeModal({ open, onClose }: SubscriptionUpgradeModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close upgrade options"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-[#1b1c19]/50 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-title"
        className="relative w-full max-w-[34rem] max-h-[90vh] overflow-y-auto rounded-2xl border border-[#c4c7c7] bg-[#fbf9f4] p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-body text-[10px] tracking-[0.18em] text-[#1b1c19]/45 uppercase">
              Partner Plans
            </span>
            <h2
              id="upgrade-title"
              className="mt-3 font-serif text-2xl leading-tight text-[#1b1c19]"
            >
              Unlock direct contact on every lead
            </h2>
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

        <p className="mt-4 font-body text-sm leading-relaxed text-[#1b1c19]/65">
          Both plans release the customer&apos;s phone, email and full address for
          every lead assigned to you, plus WhatsApp click-to-chat.
        </p>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PLANS.map(({ id, name, price, icon: Icon, points }) => (
            <div
              key={id}
              className="flex flex-col rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea] p-5"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-[#1b1c19]" />
                <h3 className="font-serif text-base text-[#1b1c19]">{name}</h3>
              </div>
              <p className="mt-3 font-serif text-2xl leading-none text-[#1b1c19] tabular-nums">
                {price}
                <span className="ml-1.5 font-body text-xs text-[#1b1c19]/50">/mo</span>
              </p>
              <ul className="mt-4 flex flex-1 flex-col gap-2">
                {points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1b1c19]/55" />
                    <span className="font-body text-xs leading-relaxed text-[#1b1c19]/70">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/partners#pricing`}
                className="group mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-[#1b1c19] px-4 py-2.5 font-body text-sm font-medium text-[#fbf9f4] transition-colors hover:bg-black"
              >
                Choose
                <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-6 font-body text-xs leading-relaxed text-[#1b1c19]/45">
          Billing is not connected yet, so these links open the plan comparison
          rather than a checkout.
        </p>
      </div>
    </div>
  );
}
