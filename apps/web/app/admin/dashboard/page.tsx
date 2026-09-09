import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Users,
  Building2,
  Inbox,
  ShieldAlert,
  ArrowRight,
  UserPlus,
  Gavel,
  ListChecks,
  type LucideIcon,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { getBusinesses, getComplaints, getLeads, getUsers } from '@/lib/admin/actions';

export const metadata: Metadata = {
  title: 'Platform Overview — Kanso Admin',
  description: 'System stats across users, partners, leads and moderation.',
};

interface Metric {
  title: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  href: string;
}

const QUICK_ACTIONS = [
  {
    label: 'Approve New Partner',
    description: 'Verify businesses waiting on approval',
    href: '/admin/businesses',
    icon: UserPlus,
  },
  {
    label: 'Review Dispute',
    description: 'Open customer complaints against vendors',
    href: '/admin/disputes',
    icon: Gavel,
  },
  {
    label: 'Assign Lead Queue',
    description: 'Route unassigned leads to a vendor',
    href: '/admin/leads?filter=unassigned',
    icon: ListChecks,
  },
];

export default async function AdminDashboardPage() {
  const [users, businesses, leads, complaints] = await Promise.all([
    getUsers(),
    getBusinesses(),
    getLeads(),
    getComplaints(),
  ]);

  const activeBusinesses = businesses.filter((b) => b.status === 'active');
  const solo = activeBusinesses.filter((b) => b.kind === 'solo_tradesman').length;
  const shop = activeBusinesses.filter((b) => b.kind === 'shop_with_crew').length;
  const unassigned = leads.filter((l) => l.businessId === null).length;
  const openComplaints = complaints.filter(
    (c) => c.status === 'open' || c.status === 'reviewing',
  );
  const flaggedVendors = new Set(openComplaints.map((c) => c.businessId)).size;
  const awaitingVerification = businesses.filter(
    (b) => b.verifiedAt === null && b.status === 'active',
  ).length;

  const metrics: Metric[] = [
    {
      title: 'Total Registered Users',
      value: users.length.toLocaleString('en-US'),
      caption: `${users.filter((u) => u.role === 'customer').length} customers, ${users.filter((u) => u.role === 'business').length} business, ${users.filter((u) => u.role === 'admin').length} admin`,
      icon: Users,
      href: '/admin/users',
    },
    {
      title: 'Active Businesses',
      value: activeBusinesses.length.toLocaleString('en-US'),
      caption: `${solo} solo tradesman, ${shop} shop + crew`,
      icon: Building2,
      href: '/admin/businesses',
    },
    {
      title: 'Total Platform Leads',
      value: leads.length.toLocaleString('en-US'),
      caption: `${unassigned} unassigned in the admin queue`,
      icon: Inbox,
      href: '/admin/leads',
    },
    {
      title: 'Active Disputes',
      value: openComplaints.length.toLocaleString('en-US'),
      caption:
        flaggedVendors === 0
          ? 'No vendors currently flagged'
          : `${flaggedVendors} flagged ${flaggedVendors === 1 ? 'vendor' : 'vendors'}`,
      icon: ShieldAlert,
      href: '/admin/disputes',
    },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Overview"
        title="System Stats"
        description="Platform health across accounts, partners, lead flow and moderation. Every figure is counted from live records."
      />

      <section aria-label="Key metrics" className="mb-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
          {metrics.map(({ title, value, caption, icon: Icon, href }) => (
            <Link
              key={title}
              href={href}
              className="group flex min-h-[160px] flex-col justify-between rounded-xl border border-[#c4c7c7] bg-[#fbf9f4] p-6 transition-colors hover:border-[#1b1c19]"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <span className="font-body-md text-sm font-medium text-[#1b1c19]/60">{title}</span>
                <Icon className="h-5 w-5 shrink-0 text-[#1b1c19]" />
              </div>
              <div>
                <div className="font-display-xl text-[40px] leading-none tracking-tight text-[#1b1c19] tabular-nums">
                  {value}
                </div>
                <div className="mt-4 font-label-sm text-xs leading-relaxed text-[#1b1c19]/55">
                  {caption}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="Quick actions">
        <h2 className="mb-5 font-serif text-xl leading-tight text-[#1b1c19]">Quick actions</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {QUICK_ACTIONS.map(({ label, description, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group flex items-start gap-4 rounded-xl border border-[#c4c7c7] bg-[#fbf9f4] p-5 transition-colors hover:border-[#1b1c19]"
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#1b1c19]" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 font-body-md text-sm font-semibold text-[#1b1c19]">
                  {label}
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1 block font-body text-xs leading-relaxed text-[#1b1c19]/60">
                  {description}
                </span>
              </span>
            </Link>
          ))}
        </div>

        {(awaitingVerification > 0 || unassigned > 0) && (
          <p className="mt-6 font-body text-sm leading-relaxed text-[#1b1c19]/60">
            {awaitingVerification > 0 && (
              <>
                {awaitingVerification} {awaitingVerification === 1 ? 'partner is' : 'partners are'}{' '}
                awaiting verification.{' '}
              </>
            )}
            {unassigned > 0 && (
              <>
                {unassigned} {unassigned === 1 ? 'lead is' : 'leads are'} unassigned and not
                reaching any vendor.
              </>
            )}
          </p>
        )}
      </section>
    </>
  );
}
