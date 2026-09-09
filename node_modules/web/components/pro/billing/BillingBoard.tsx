"use client";

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Check,
  Users,
  CalendarClock,
  AlertCircle,
  Loader2,
  Lock,
  Unlock,
} from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';
import {
  PAID_TIERS,
  STATUS_LABELS,
  TIERS,
  formatTierPricePkr,
  type Tier,
  type TierId,
} from '@/lib/pro/tiers';
import type { PaymentDetails, SubscriptionSummary } from '@/lib/pro/subscriptions';

interface BillingBoardProps {
  subscription: SubscriptionSummary;
  upgradeAction: (
    businessId: string,
    tier: TierId,
    payment: PaymentDetails,
  ) => Promise<{ ok: boolean; error?: string }>;
  cancelAction: (businessId: string) => Promise<{ ok: boolean; error?: string }>;
}

/** Status pill colour: only a lapsed or failing plan should read as a warning. */
const STATUS_STYLES: Record<string, string> = {
  active: 'border-[#3c6b4a]/30 bg-[#3c6b4a]/10 text-[#3c6b4a]',
  trialing: 'border-[#3c6b4a]/30 bg-[#3c6b4a]/10 text-[#3c6b4a]',
  past_due: 'border-[#92651a]/30 bg-[#92651a]/12 text-[#92651a]',
  canceled: 'border-[#92651a]/30 bg-[#92651a]/12 text-[#92651a]',
  expired: 'border-[#c4c7c7] bg-[#f4f0ea] text-[#1b1c19]/60',
};

function formatRenewal(iso: string | null): string {
  if (!iso) return 'No active billing period';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function BillingBoard({ subscription, upgradeAction, cancelAction }: BillingBoardProps) {
  const [checkoutTier, setCheckoutTier] = useState<Tier | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const currentTier = TIERS[subscription.tier];
  const { hasPaidAccess, status, seats, seatsUsed, currentPeriodEnd } = subscription;

  const handleConfirm = async (tierId: TierId, payment: PaymentDetails) => {
    const result = await upgradeAction(subscription.businessId, tierId, payment);
    if (!result.ok) return result;
    setNotice(null);
    return result;
  };

  const handleCancel = () => {
    setNotice(null);
    startTransition(async () => {
      const result = await cancelAction(subscription.businessId);
      if (!result.ok) setNotice(result.error ?? 'Could not cancel that plan.');
    });
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Current plan */}
      <section className="rounded-2xl border border-[#c4c7c7] bg-[#fbf9f4] p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <span className="font-body text-[10px] tracking-[0.18em] text-[#1b1c19]/45 uppercase">
              Current Plan
            </span>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h2 className="font-serif text-2xl leading-tight text-[#1b1c19]">
                {currentTier.name}
              </h2>
              <span
                className={`rounded border px-2.5 py-1 font-body text-[10px] tracking-[0.12em] uppercase ${
                  STATUS_STYLES[status] ?? STATUS_STYLES.expired
                }`}
              >
                {STATUS_LABELS[status]}
              </span>
            </div>
            <p className="mt-3 max-w-[38rem] font-body text-sm leading-relaxed text-[#1b1c19]/65">
              {currentTier.summary}
            </p>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <p className="font-serif text-2xl text-[#1b1c19] tabular-nums">
              {formatTierPricePkr(currentTier)}
            </p>
            {currentTier.pricePkr > 0 && (
              <p className="mt-1 font-body text-xs text-[#1b1c19]/50">per month</p>
            )}
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-6 border-t border-[#c4c7c7] pt-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#1b1c19]/55" />
            <div>
              <dt className="font-body text-[10px] tracking-[0.12em] text-[#1b1c19]/45 uppercase">
                Seat Usage
              </dt>
              <dd className="mt-1.5 font-body text-sm text-[#1b1c19] tabular-nums">
                {seatsUsed} / {seats} {seats === 1 ? 'Seat' : 'Seats'} Used
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-[#1b1c19]/55" />
            <div>
              <dt className="font-body text-[10px] tracking-[0.12em] text-[#1b1c19]/45 uppercase">
                {status === 'canceled' ? 'Access Until' : 'Next Renewal'}
              </dt>
              <dd className="mt-1.5 font-body text-sm text-[#1b1c19]">
                {formatRenewal(currentPeriodEnd)}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3">
            {hasPaidAccess ? (
              <Unlock className="mt-0.5 h-4 w-4 shrink-0 text-[#3c6b4a]" />
            ) : (
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#1b1c19]/55" />
            )}
            <div>
              <dt className="font-body text-[10px] tracking-[0.12em] text-[#1b1c19]/45 uppercase">
                Lead Contacts
              </dt>
              <dd className="mt-1.5 font-body text-sm text-[#1b1c19]">
                {hasPaidAccess ? 'Unlocked' : 'Locked'}
              </dd>
            </div>
          </div>
        </dl>

        {status === 'canceled' && (
          <p className="mt-6 flex items-start gap-2 font-body text-sm leading-relaxed text-[#92651a]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            This plan is set to expire at the end of the current period. You keep
            full access until then.
          </p>
        )}

        {hasPaidAccess && status !== 'canceled' && (
          <div className="mt-6 border-t border-[#c4c7c7] pt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={pending}
              className="inline-flex min-h-[44px] items-center gap-2 font-body text-sm text-[#1b1c19]/60 underline-offset-4 transition-colors hover:text-[#1b1c19] hover:underline disabled:opacity-60"
            >
              {pending && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
              Cancel at period end
            </button>
          </div>
        )}
      </section>

      {notice && (
        <p role="alert" className="flex items-start gap-2 font-body text-sm text-[#9d3f30]">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {notice}
        </p>
      )}

      {/* Plans */}
      <section>
        <div className="mb-6">
          <h2 className="font-serif text-xl leading-tight text-[#1b1c19] sm:text-2xl">
            {hasPaidAccess ? 'Change your plan' : 'Choose a plan'}
          </h2>
          <p className="mt-2 max-w-[42rem] font-body text-sm leading-relaxed text-[#1b1c19]/65">
            Leads are only released to partners on an active plan. Both tiers
            unlock the customer&apos;s phone, email and full address on every
            lead assigned to you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {PAID_TIERS.map((tier) => {
            const Icon = tier.icon;
            const isCurrent = subscription.tier === tier.id && hasPaidAccess;
            return (
              <article
                key={tier.id}
                className={`flex w-full flex-col rounded-2xl p-6 sm:p-8 ${
                  tier.featured
                    ? 'bg-[#1b1c19] text-[#fbf9f4]'
                    : 'border border-[#c4c7c7] bg-[#fbf9f4] text-[#1b1c19]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 shrink-0 ${tier.featured ? 'text-[#fbf9f4]' : 'text-[#1b1c19]'}`}
                  />
                  <h3 className="font-serif text-xl leading-tight">{tier.name}</h3>
                  {isCurrent && (
                    <span
                      className={`rounded px-2 py-0.5 font-body text-[10px] tracking-[0.12em] uppercase ${
                        tier.featured ? 'bg-[#fbf9f4]/15 text-[#fbf9f4]/80' : 'bg-[#f4f0ea] text-[#1b1c19]/60'
                      }`}
                    >
                      Current
                    </span>
                  )}
                </div>

                <p
                  className={`mt-2 font-body text-xs tracking-[0.12em] uppercase ${
                    tier.featured ? 'text-[#fbf9f4]/55' : 'text-[#1b1c19]/45'
                  }`}
                >
                  {tier.audience}
                </p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-serif text-3xl leading-none tabular-nums">
                    {formatTierPricePkr(tier)}
                  </span>
                  <span
                    className={`font-body text-sm ${tier.featured ? 'text-[#fbf9f4]/55' : 'text-[#1b1c19]/50'}`}
                  >
                    / month
                  </span>
                </div>
                <p
                  className={`mt-1 font-body text-xs ${tier.featured ? 'text-[#fbf9f4]/45' : 'text-[#1b1c19]/45'}`}
                >
                  Billed monthly in PKR
                </p>

                <ul className="mt-7 flex flex-1 flex-col gap-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          tier.featured ? 'text-[#fbf9f4]/70' : 'text-[#1b1c19]/55'
                        }`}
                      />
                      <span
                        className={`font-body text-sm leading-relaxed ${
                          tier.featured ? 'text-[#fbf9f4]/85' : 'text-[#1b1c19]/75'
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => setCheckoutTier(tier)}
                  className={`mt-8 inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl px-6 py-3 font-body text-sm font-medium transition-colors duration-300 disabled:cursor-default disabled:opacity-55 ${
                    tier.featured
                      ? 'bg-[#fbf9f4] text-[#1b1c19] hover:bg-white'
                      : 'bg-[#1b1c19] text-[#fbf9f4] hover:bg-black'
                  }`}
                >
                  {isCurrent ? 'Your Current Plan' : tier.cta}
                </button>
              </article>
            );
          })}
        </div>

        <p className="mt-8 font-body text-sm leading-relaxed text-[#1b1c19]/50">
          Comparing plans in more detail?{' '}
          <Link
            href="/partners#pricing"
            className="font-medium text-[#1b1c19] underline-offset-4 transition-colors hover:underline"
          >
            See the full partner plan comparison
          </Link>
          .
        </p>
      </section>

      {checkoutTier && (
        <CheckoutModal
          tier={checkoutTier}
          onClose={() => setCheckoutTier(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
