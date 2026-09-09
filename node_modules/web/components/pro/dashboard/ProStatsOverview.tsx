import React from 'react';
import { Users, Target, Wallet, Package, type LucideIcon } from 'lucide-react';
import { formatPkrCompact, ITEMS_PER_ROOM_ESTIMATE, type VendorAnalytics } from '@/lib/pro/analytics';

interface ProStatsOverviewProps {
  analytics: VendorAnalytics;
}

interface MetricCard {
  title: string;
  value: string;
  caption: string;
  icon: LucideIcon;
}

function buildCards(a: VendorAnalytics): MetricCard[] {
  const openLeads = a.byStatus.new + a.byStatus.contacted;

  return [
    {
      title: 'Total Customer Leads',
      value: a.totalLeads.toLocaleString('en-US'),
      caption: `${a.byStatus.new} new, ${a.byStatus.contacted} contacted, ${a.byStatus.completed} completed`,
      icon: Users,
    },
    {
      title: 'Conversion Rate',
      value: `${a.conversionRate}%`,
      caption:
        a.totalLeads === 0
          ? 'No leads assigned yet'
          : `${a.byStatus.completed} of ${a.totalLeads} leads completed`,
      icon: Target,
    },
    {
      title: 'Est. Pipeline Revenue',
      value:
        a.estimatedProjectValueMinor === 0
          ? 'Not estimable'
          : formatPkrCompact(a.pipelineRevenueMinor),
      caption:
        a.estimatedProjectValueMinor === 0
          ? 'Price your catalogue to estimate pipeline'
          : `${openLeads} open ${openLeads === 1 ? 'lead' : 'leads'} at approx. ${formatPkrCompact(a.estimatedProjectValueMinor)} each`,
      icon: Wallet,
    },
    {
      title: 'Active Catalog Items',
      value: a.activeCatalogItems.toLocaleString('en-US'),
      caption:
        a.averageItemPriceMinor === null
          ? 'No priced items yet'
          : `Average item ${formatPkrCompact(a.averageItemPriceMinor)}`,
      icon: Package,
    },
  ];
}

export function ProStatsOverview({ analytics }: ProStatsOverviewProps) {
  const cards = buildCards(analytics);

  return (
    <section aria-label="Performance overview" className="mb-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
        {cards.map(({ title, value, caption, icon: Icon }) => (
          <div
            key={title}
            className="flex min-h-[160px] flex-col justify-between rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
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
          </div>
        ))}
      </div>

      {/* The pipeline figure is an estimate; say so rather than let a vendor
          read it as booked revenue. */}
      {analytics.estimatedProjectValueMinor > 0 && (
        <p className="mt-4 font-label-sm text-xs leading-relaxed text-[#1b1c19]/45">
          Pipeline revenue is an estimate: average catalogue item price multiplied
          by {ITEMS_PER_ROOM_ESTIMATE} items per room, applied to open leads. It is
          not booked revenue.
        </p>
      )}
    </section>
  );
}
