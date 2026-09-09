"use client";

import React from 'react';
import { LEAD_FILTERS, type LeadFilter } from '@/lib/pro/leads';

interface LeadStatusFilterTabsProps {
  currentTab: LeadFilter;
  onTabChange: (tab: LeadFilter) => void;
  /** Row count per filter, so a vendor sees where the work is before clicking. */
  counts?: Partial<Record<LeadFilter, number>>;
}

export function LeadStatusFilterTabs({ currentTab, onTabChange, counts }: LeadStatusFilterTabsProps) {
  return (
    <div className="flex overflow-x-auto gap-2 pb-2 mb-2 scrollbar-hide" role="tablist">
      {LEAD_FILTERS.map(({ value, label }) => {
        const active = currentTab === value;
        const count = counts?.[value];
        return (
          <button
            key={value}
            role="tab"
            aria-selected={active}
            onClick={() => onTabChange(value)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-label-sm text-[10px] uppercase tracking-widest transition-colors duration-200 ${
              active
                ? 'bg-primary text-on-primary'
                : 'bg-[#F4F2ED] text-secondary hover:bg-[#EAE8E3] hover:text-primary border border-outline-variant/30'
            }`}
          >
            {label}
            {typeof count === 'number' && (
              <span className={active ? 'ml-2 opacity-70' : 'ml-2 opacity-60'}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
