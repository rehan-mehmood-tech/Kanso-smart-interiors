"use client";

import React from 'react';

export type AdminTab = 'Partner Studios' | 'All Inquiries / Leads' | 'User Accounts' | 'System Settings';

interface AdminNavigationTabsProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const TABS: AdminTab[] = ['Partner Studios', 'All Inquiries / Leads', 'User Accounts', 'System Settings'];

export function AdminNavigationTabs({ currentTab, onTabChange }: AdminNavigationTabsProps) {
  return (
    <div className="flex overflow-x-auto gap-2 pb-2 mb-6 scrollbar-hide border-b border-outline-variant/30">
      {TABS.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`whitespace-nowrap px-6 py-3 font-label-sm text-xs uppercase tracking-widest transition-colors duration-200 border-b-2 ${
            currentTab === tab 
              ? 'border-primary text-primary font-bold bg-[#F4F2ED]/50' 
              : 'border-transparent text-secondary hover:text-primary hover:bg-[#F4F2ED]/30'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
