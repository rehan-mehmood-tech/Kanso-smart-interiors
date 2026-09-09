"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LeadStatusFilterTabs, LeadStatus } from './LeadStatusFilterTabs';
import { EmptyLeadState } from './EmptyLeadState';
import { Search } from 'lucide-react';

export interface ProLeadItem {
  id: string;
  name: string;
  location: string;
  roomType: string;
  style: string;
  budget: string;
  status: 'New' | 'In Progress' | 'Action Req' | 'Closed';
  date: string;
  avatarUrl?: string;
  initial: string;
  captureStatus?: string;
}

const MOCK_LEADS: ProLeadItem[] = [
  {
    id: 'lead-1',
    name: 'Sarah Jenkins',
    location: 'Lahore, PK',
    roomType: 'Living Room & Kitchen',
    style: 'Japandi',
    budget: 'High Budget',
    status: 'New',
    date: '2h ago',
    captureStatus: '4/4 Photos',
    avatarUrl: '/assets/images/rooms/interior-wide-1.jpg',
    initial: 'S'
  },
  {
    id: 'lead-2',
    name: 'Michael Chen',
    location: 'Islamabad, PK',
    roomType: 'Master Suite Remodel',
    style: 'Minimalist',
    budget: 'Medium Budget',
    status: 'In Progress',
    date: 'Yesterday',
    captureStatus: '2/4 Photos',
    avatarUrl: '/assets/images/rooms/interior-wide-1.jpg',
    initial: 'M'
  },
  {
    id: 'lead-3',
    name: 'Elena Rossi',
    location: 'Karachi, PK',
    roomType: 'Home Office',
    style: 'Mid-Century',
    budget: 'Low Budget',
    status: 'Action Req',
    date: '3 days ago',
    captureStatus: '4/4 Photos',
    initial: 'E'
  }
];

export function LeadTable() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<LeadStatus>('All Leads');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeads = MOCK_LEADS.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lead.roomType.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'All Leads') return matchesSearch;
    if (activeTab === 'New Inquiries') return matchesSearch && lead.status === 'New';
    if (activeTab === 'Contacted') return matchesSearch && lead.status === 'In Progress';
    if (activeTab === 'Completed / Locked') return matchesSearch && lead.status === 'Closed';
    
    return matchesSearch;
  });

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col w-full overflow-hidden">
      <div className="p-6 border-b border-surface-container flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="font-display-xl text-2xl md:text-[28px] tracking-tight text-on-surface">Recent Leads</h2>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-secondary" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-outline-variant/50 rounded-lg bg-surface-container-low text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors placeholder:text-secondary"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-6 pb-2 border-b border-surface-container">
        <LeadStatusFilterTabs currentTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="flex-1 overflow-y-auto min-h-[400px]">
        {filteredLeads.length === 0 ? (
          <EmptyLeadState />
        ) : (
          <div className="flex flex-col">
            {filteredLeads.map((lead) => (
              <div 
                key={lead.id}
                className="p-4 md:p-6 border-b border-surface-container hover:bg-[#F4F2ED] transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
              >
                <div className="flex gap-4 items-center">
                  <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#EAE8E3] overflow-hidden shrink-0 flex items-center justify-center border border-outline-variant/30 text-secondary">
                    {lead.avatarUrl ? (
                      <Image src={lead.avatarUrl} alt={lead.name} fill sizes="56px" className="object-cover" />
                    ) : (
                      <span className="font-display-xl text-xl md:text-[24px] text-primary">{lead.initial}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-body-md text-base md:text-[18px] text-on-surface font-semibold tracking-tight">
                      {lead.name}
                    </h3>
                    <p className="font-label-sm text-xs text-secondary mt-1">
                      {lead.roomType} • {lead.location}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap md:ml-auto items-center">
                  <span className="px-2 py-1 border border-outline-variant/50 text-secondary font-label-sm text-[10px] uppercase tracking-wider rounded bg-[#FBF9F4]">
                    {lead.style}
                  </span>
                  <span className="px-2 py-1 border border-outline-variant/50 text-secondary font-label-sm text-[10px] uppercase tracking-wider rounded bg-[#FBF9F4] hidden sm:inline-block">
                    {lead.captureStatus}
                  </span>
                  <span className={`px-2 py-1 font-label-sm text-[10px] uppercase tracking-wider rounded ${
                    lead.status === 'New' ? 'bg-primary/10 text-primary border border-primary/20' :
                    lead.status === 'Action Req' ? 'bg-[#EAE8E3] text-on-surface border border-outline-variant/50' :
                    'bg-[#FBF9F4] text-secondary border border-outline-variant/50'
                  }`}>
                    {lead.status === 'Action Req' ? 'Action Req' : lead.status}
                  </span>
                  <button 
                    onClick={() => router.push(`/pro/leads/${lead.id}`)}
                    className="ml-2 font-label-sm text-xs text-primary hover:text-secondary underline-offset-4 hover:underline transition-all hidden md:block"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
