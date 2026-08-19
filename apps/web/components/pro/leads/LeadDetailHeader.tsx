"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface LeadDetailHeaderProps {
  leadId: string;
  leadName: string;
  roomType: string;
}

export function LeadDetailHeader({ leadId, leadName, roomType }: LeadDetailHeaderProps) {
  const [status, setStatus] = useState('New');
  const [isOpen, setIsOpen] = useState(false);

  const statuses = ['New', 'Contacted', 'In Review', 'Won', 'Archived'];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
      <div>
        <Link href="/pro/dashboard" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors font-label-sm text-xs uppercase tracking-widest mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Lead Pipeline
        </Link>
        <div className="flex items-center gap-4">
          <h1 className="font-display-xl text-3xl md:text-4xl text-primary leading-tight tracking-tight">
            {leadName} - {roomType}
          </h1>
          <span className="px-3 py-1 bg-[#F4F2ED] border border-outline-variant/30 rounded-full font-label-sm text-[10px] text-secondary tracking-widest uppercase hidden md:inline-block">
            ID: {leadId.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant/50 px-4 py-2.5 rounded-lg text-primary font-label-sm text-sm min-w-[160px] justify-between hover:bg-surface-container-low transition-colors shadow-sm"
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'New' ? 'bg-blue-500' : status === 'Won' ? 'bg-green-500' : status === 'Archived' ? 'bg-gray-400' : 'bg-yellow-500'}`}></div>
            {status}
          </div>
          <ChevronDown className="w-4 h-4 text-secondary" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-[160px] bg-surface-container-lowest border border-outline-variant/30 rounded-lg shadow-lg z-50 overflow-hidden">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => { setStatus(s); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 font-label-sm text-xs hover:bg-[#F4F2ED] transition-colors text-primary border-b border-outline-variant/10 last:border-b-0"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
