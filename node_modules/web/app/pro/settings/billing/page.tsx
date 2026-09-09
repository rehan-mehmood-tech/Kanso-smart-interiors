import React from 'react';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ProSidebar } from '@/components/pro/layout/ProSidebar';
import { BillingBoard } from '@/components/pro/billing/BillingBoard';
import {
  cancelSubscription,
  getSubscriptionStatus,
  upgradeSubscription,
} from '@/lib/pro/subscriptions';

export const metadata: Metadata = {
  title: 'Billing & Subscriptions — Kanso Partner Portal',
  description: 'Manage your Kanso partner plan, seats and renewal.',
};

export default async function BillingSettingsPage() {
  const subscription = await getSubscriptionStatus();

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1B1C19] font-body-md">
      <SiteHeader position="fixed" />

      <div className="flex pt-16">
        <ProSidebar />

        <main className="flex-1 flex flex-col w-full lg:ml-64 min-h-screen">
          <div className="p-4 md:p-8 lg:p-12 flex-1 flex flex-col max-w-[1400px] mx-auto w-full">
            <header className="mb-8 flex flex-col gap-4 border-b border-[#c4c7c7] pb-8">
              <span className="font-body text-xs tracking-[0.2em] text-[#1b1c19]/45 uppercase">
                Settings
              </span>
              <h1 className="font-display-xl text-3xl tracking-tight text-[#1b1c19] md:text-4xl">
                Billing &amp; Subscriptions
              </h1>
              <p className="max-w-[46rem] font-body text-sm leading-relaxed text-[#1b1c19]/65 sm:text-base">
                Your plan decides how many people can work in this account and
                whether customer contact details are released on your leads.
              </p>
            </header>

            <BillingBoard
              subscription={subscription}
              upgradeAction={upgradeSubscription}
              cancelAction={cancelSubscription}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
