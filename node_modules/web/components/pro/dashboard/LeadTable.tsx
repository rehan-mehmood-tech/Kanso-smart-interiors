"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { LeadStatusFilterTabs } from './LeadStatusFilterTabs';
import { LeadStatusBadge } from './LeadStatusBadge';
import { EmptyLeadState } from './EmptyLeadState';
import {
  formatSubmittedAt,
  toDisplayName,
  type LeadFilter,
  type MaskedLead,
} from '@/lib/pro/leads';

interface LeadTableProps {
  /** Rows as returned by the `leads_masked` view. */
  leads: MaskedLead[];
}

export function LeadTable({ leads }: LeadTableProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LeadFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const counts = useMemo(
    () => ({
      all: leads.length,
      new: leads.filter((l) => l.status === 'new').length,
      contacted: leads.filter((l) => l.status === 'contacted').length,
      completed: leads.filter((l) => l.status === 'completed').length,
    }),
    [leads],
  );

  const filteredLeads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesSearch =
        query.length === 0 ||
        toDisplayName(lead.customerName).toLowerCase().includes(query) ||
        lead.roomType.toLowerCase().includes(query) ||
        lead.city.toLowerCase().includes(query) ||
        lead.styleSlug.toLowerCase().includes(query);

      const matchesTab = activeTab === 'all' || lead.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [leads, searchQuery, activeTab]);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col w-full overflow-hidden">
      <div className="p-6 border-b border-surface-container flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-display-xl text-2xl md:text-[28px] tracking-tight text-on-surface">
          Assigned Leads
        </h2>

        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-secondary" />
          </div>
          <label htmlFor="lead-search" className="sr-only">
            Search leads
          </label>
          <input
            id="lead-search"
            type="search"
            className="block w-full pl-10 pr-3 py-2 border border-outline-variant/50 rounded-lg bg-surface-container-low text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors placeholder:text-secondary"
            placeholder="Name, room, city or style"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-6 pb-2 border-b border-surface-container">
        <LeadStatusFilterTabs currentTab={activeTab} onTabChange={setActiveTab} counts={counts} />
      </div>

      <div className="flex-1 overflow-y-auto min-h-[400px]">
        {filteredLeads.length === 0 ? (
          <EmptyLeadState />
        ) : (
          <ul className="flex flex-col">
            {filteredLeads.map((lead) => (
              <li key={lead.id}>
                <button
                  type="button"
                  onClick={() => router.push(`/pro/leads/${lead.id}`)}
                  className="w-full text-left p-4 md:p-6 border-b border-surface-container hover:bg-[#F4F2ED] focus:bg-[#F4F2ED] focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                >
                  <div className="flex gap-4 items-center min-w-0">
                    {/* Surnames are withheld in the list for every account, so
                        an initial is all the avatar can carry. */}
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#EAE8E3] shrink-0 flex items-center justify-center border border-outline-variant/30">
                      <span className="font-display-xl text-xl md:text-[24px] text-primary">
                        {lead.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-body-md text-base md:text-[18px] text-on-surface font-semibold tracking-tight truncate">
                        {toDisplayName(lead.customerName)}
                      </h3>
                      <p className="font-label-sm text-xs text-secondary mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {lead.roomType} &middot; {lead.city}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap md:ml-auto items-center shrink-0">
                    <span className="px-2 py-1 border border-outline-variant/50 text-secondary font-label-sm text-[10px] uppercase tracking-wider rounded bg-[#FBF9F4]">
                      {lead.styleSlug.replace(/_/g, ' ')}
                    </span>
                    <span className="px-2 py-1 border border-outline-variant/50 text-secondary font-label-sm text-[10px] uppercase tracking-wider rounded bg-[#FBF9F4] hidden sm:inline-block">
                      {lead.captureStatus}
                    </span>
                    <LeadStatusBadge status={lead.status} />
                    <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary tabular-nums">
                      {formatSubmittedAt(lead.createdAt)}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
