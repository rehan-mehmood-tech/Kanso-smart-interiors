"use client";

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface LeadAuditRecord {
  id: string;
  homeowner: string;
  projectType: string;
  submissionDate: string;
  assignedPartner: string | null;
  status: 'Matched' | 'Pending Allocation' | 'Reviewing';
}

const MOCK_AUDIT: LeadAuditRecord[] = [
  { id: 'L-8492', homeowner: 'Sarah Jenkins', projectType: 'Living Room • Japandi', submissionDate: '2 hours ago', assignedPartner: 'Rossi Architecture', status: 'Matched' },
  { id: 'L-8493', homeowner: 'Michael Chen', projectType: 'Master Suite • Minimalist', submissionDate: '5 hours ago', assignedPartner: 'Studio Nord', status: 'Matched' },
  { id: 'L-8494', homeowner: 'Aisha Khan', projectType: 'Kitchen • Warm Min.', submissionDate: '1 day ago', assignedPartner: null, status: 'Pending Allocation' },
  { id: 'L-8495', homeowner: 'James Smith', projectType: 'Home Office • Mid-Cent.', submissionDate: '2 days ago', assignedPartner: null, status: 'Reviewing' }
];

export function RecentLeadsAuditTable() {
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Matched': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending Allocation': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Reviewing': return 'bg-[#EAE8E3] text-secondary border-outline-variant/50';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden mt-8">
      
      <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-[#FBF9F4]">
        <div>
          <h2 className="font-display-xl text-xl text-primary tracking-tight">Recent Leads Audit Log</h2>
          <p className="font-body-md text-sm text-secondary mt-1">Cross-platform tracking of inbound AI generations to specialist allocation.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-[#F4F2ED]/30">
              <th className="p-4 font-label-sm text-[10px] uppercase tracking-widest text-secondary font-medium">Ref ID</th>
              <th className="p-4 font-label-sm text-[10px] uppercase tracking-widest text-secondary font-medium">Homeowner & Project</th>
              <th className="p-4 font-label-sm text-[10px] uppercase tracking-widest text-secondary font-medium hidden sm:table-cell">Submission Time</th>
              <th className="p-4 font-label-sm text-[10px] uppercase tracking-widest text-secondary font-medium hidden md:table-cell">Assigned Partner</th>
              <th className="p-4 font-label-sm text-[10px] uppercase tracking-widest text-secondary font-medium">Allocation Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {MOCK_AUDIT.map(record => (
              <tr key={record.id} className="hover:bg-[#F4F2ED]/30 transition-colors">
                <td className="p-4 font-label-sm text-xs text-secondary">{record.id}</td>
                <td className="p-4">
                  <div className="font-body-md text-sm text-primary font-semibold">{record.homeowner}</div>
                  <div className="font-label-sm text-[10px] text-secondary uppercase tracking-widest mt-1">{record.projectType}</div>
                </td>
                <td className="p-4 hidden sm:table-cell font-body-md text-sm text-secondary">{record.submissionDate}</td>
                <td className="p-4 hidden md:table-cell">
                  {record.assignedPartner ? (
                    <span className="font-body-md text-sm text-primary inline-flex items-center gap-1 hover:underline cursor-pointer">
                      {record.assignedPartner} <ArrowUpRight className="w-3 h-3 text-secondary" />
                    </span>
                  ) : (
                    <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary italic">Unassigned</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`inline-block px-2.5 py-1 rounded border font-label-sm text-[10px] uppercase tracking-widest ${getStatusBadge(record.status)}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-outline-variant/30 bg-[#FBF9F4] text-center">
        <button className="font-label-sm text-[10px] uppercase tracking-widest text-primary hover:text-secondary transition-colors">
          View Full Audit Trail
        </button>
      </div>

    </div>
  );
}
