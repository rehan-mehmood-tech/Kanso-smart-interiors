"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  CreditCard,
  Smartphone,
  Landmark,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import {
  formatTierPricePkr,
  formatTierPriceUsd,
  type Tier,
  type TierId,
} from '@/lib/pro/tiers';
import type { PaymentDetails } from '@/lib/pro/subscriptions';

interface CheckoutModalProps {
  tier: Tier;
  onClose: () => void;
  onConfirm: (
    tierId: TierId,
    payment: PaymentDetails,
  ) => Promise<{ ok: boolean; error?: string }>;
}

type MethodId = PaymentDetails['method'];

interface MethodOption {
  id: MethodId;
  label: string;
  hint: string;
  icon: typeof CreditCard;
  group: 'global' | 'local';
}

const METHODS: MethodOption[] = [
  {
    id: 'card',
    label: 'Card',
    hint: 'Visa, Mastercard. Processed by Stripe.',
    icon: CreditCard,
    group: 'global',
  },
  {
    id: 'payfast',
    label: 'PayFast',
    hint: 'Pakistani cards and bank accounts.',
    icon: CreditCard,
    group: 'local',
  },
  {
    id: 'jazzcash',
    label: 'JazzCash',
    hint: 'Mobile wallet transfer.',
    icon: Smartphone,
    group: 'local',
  },
  {
    id: 'easypaisa',
    label: 'EasyPaisa',
    hint: 'Mobile wallet transfer.',
    icon: Smartphone,
    group: 'local',
  },
  {
    id: 'bank_transfer',
    label: 'Bank Deposit',
    hint: 'Direct transfer, upload your deposit slip.',
    icon: Landmark,
    group: 'local',
  },
];

const fieldClass =
  'w-full min-h-[44px] rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea] px-4 py-3 font-body text-sm text-[#1b1c19] outline-none transition-colors placeholder:text-[#1b1c19]/40 focus:border-[#1b1c19] focus:ring-1 focus:ring-[#1b1c19]';

export function CheckoutModal({ tier, onClose, onConfirm }: CheckoutModalProps) {
  const [method, setMethod] = useState<MethodId>('card');
  const [reference, setReference] = useState('');
  const [receiptName, setReceiptName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const needsReceipt = method === 'bank_transfer';
  const needsReference = method === 'jazzcash' || method === 'easypaisa';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (needsReceipt && !receiptName) {
      setError('Attach your deposit slip so we can match the payment.');
      return;
    }
    if (needsReference && reference.trim().length < 4) {
      setError('Enter the transaction reference from your wallet receipt.');
      return;
    }

    setIsSubmitting(true);
    const result = await onConfirm(tier.id, {
      method,
      reference: reference.trim() || undefined,
      receiptName: receiptName ?? undefined,
    });

    if (!result.ok) {
      setError(result.error ?? 'That payment could not be completed.');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    onClose();
  };

  const renderGroup = (group: 'global' | 'local', heading: string) => (
    <fieldset>
      <legend className="mb-3 font-body text-[10px] tracking-[0.16em] text-[#1b1c19]/45 uppercase">
        {heading}
      </legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {METHODS.filter((m) => m.group === group).map(({ id, label, hint, icon: Icon }) => {
          const active = method === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setMethod(id);
                setError(null);
              }}
              className={`flex min-h-[44px] items-start gap-3 rounded-2xl border p-4 text-left transition-colors duration-200 ${
                active
                  ? 'border-[#1b1c19] bg-[#f4f0ea]'
                  : 'border-[#c4c7c7] bg-[#fbf9f4] hover:border-[#1b1c19]'
              }`}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#1b1c19]" />
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-body text-sm font-medium text-[#1b1c19]">
                  {label}
                  {active && <Check className="h-3.5 w-3.5 shrink-0" />}
                </span>
                <span className="mt-0.5 block font-body text-xs leading-relaxed text-[#1b1c19]/55">
                  {hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 py-8">
      <button
        type="button"
        aria-label="Cancel checkout"
        onClick={onClose}
        className="fixed inset-0 h-full w-full cursor-default bg-[#1b1c19]/50 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="relative w-full max-w-[38rem] rounded-2xl border border-[#c4c7c7] bg-[#fbf9f4] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#c4c7c7] p-6 sm:p-8">
          <div>
            <span className="font-body text-[10px] tracking-[0.18em] text-[#1b1c19]/45 uppercase">
              Checkout
            </span>
            <h2 id="checkout-title" className="mt-3 font-serif text-2xl leading-tight text-[#1b1c19]">
              {tier.name}
            </h2>
            <p className="mt-2 font-serif text-xl text-[#1b1c19] tabular-nums">
              {formatTierPricePkr(tier)}
              <span className="ml-2 font-body text-sm text-[#1b1c19]/50">
                / month &middot; {formatTierPriceUsd(tier)}
              </span>
            </p>
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 sm:p-8">
          {renderGroup('global', 'Card and global payments')}
          {renderGroup('local', 'Pakistan local payments')}

          {needsReference && (
            <div>
              <label htmlFor="pay-ref" className="mb-2 block font-body text-sm font-medium text-[#1b1c19]">
                Transaction reference
              </label>
              <input
                id="pay-ref"
                className={fieldClass}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. TXN-8842190"
              />
            </div>
          )}

          {needsReceipt && (
            <div>
              <span className="mb-2 block font-body text-sm font-medium text-[#1b1c19]">
                Deposit slip
              </span>
              <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-[#c4c7c7] bg-[#f4f0ea] px-4 py-3 text-[#1b1c19]/65 transition-colors hover:border-[#1b1c19] hover:text-[#1b1c19]">
                <Upload className="h-4 w-4 shrink-0" />
                <span className="font-body text-sm">
                  {receiptName ?? 'Attach a photo or PDF of your deposit slip'}
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="sr-only"
                  onChange={(e) => {
                    setReceiptName(e.target.files?.[0]?.name ?? null);
                    setError(null);
                  }}
                />
              </label>
              <p className="mt-2 font-body text-xs leading-relaxed text-[#1b1c19]/45">
                Bank deposits are normally confirmed by our team before the plan
                activates.
              </p>
            </div>
          )}

          {error && (
            <p role="alert" className="flex items-start gap-2 font-body text-sm text-[#9d3f30]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <div className="flex items-start gap-3 rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea] p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1b1c19]/55" />
            <p className="font-body text-xs leading-relaxed text-[#1b1c19]/65">
              No payment provider is connected yet, so no card is charged and no
              money moves. Confirming activates the plan locally so you can see
              what a paid account unlocks.
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#c4c7c7] pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] rounded-2xl border border-[#c4c7c7] px-6 py-3 font-body text-sm font-medium text-[#1b1c19] transition-colors hover:bg-[#f4f0ea]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#1b1c19] px-6 py-3 font-body text-sm font-medium text-[#fbf9f4] transition-colors hover:bg-black disabled:cursor-wait disabled:opacity-80"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
              {isSubmitting ? 'Activating' : `Confirm ${formatTierPricePkr(tier)} / month`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
