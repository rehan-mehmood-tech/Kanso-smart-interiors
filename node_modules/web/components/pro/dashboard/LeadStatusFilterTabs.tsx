"use client";

import React from 'react';

export type LeadStatus = 'All Leads' | 'New Inquiries' | 'Contacted' | 'Completed / Locked';

interface LeadStatusFilterTabsProps {
  currentTab: LeadStatus;
  onTabChange: (tab: LeadStatus) => void;
}

const TABS: LeadStatus[] = ['All Leads', 'New Inquiries', 'Contacted', 'Completed / Locked'];

export function LeadStatusFilterTabs({ currentTab, onTabChange }: LeadStatusFilterTabsProps) {
  return (
    <div className="flex overflow-x-auto gap-2 pb-2 mb-2 scrollbar-hide">
      {TABS.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`whitespace-nowrap px-4 py-2 rounded-full font-label-sm text-[10px] uppercase tracking-widest transition-colors duration-200 ${
            currentTab === tab 
              ? 'bg-primary text-on-primary' 
              : 'bg-[#F4F2ED] text-secondary hover:bg-[#EAE8E3] hover:text-primary border border-outline-variant/30'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
