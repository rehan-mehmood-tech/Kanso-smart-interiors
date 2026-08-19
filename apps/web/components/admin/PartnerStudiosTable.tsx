"use client";

import React from 'react';
import { MoreVertical, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export interface AdminPartnerItem {
  id: string;
  studioName: string;
  contactPerson: string;
  location: string;
  status: 'Active' | 'Pending Review' | 'Suspended';
  activeLeads: number;
  capacity: number;
  joinDate: string;
}

const MOCK_PARTNERS: AdminPartnerItem[] = [
  { id: 'p1', studioName: 'Rossi Architecture', contactPerson: 'Elena Rossi', location: 'Lahore, PK', status: 'Active', activeLeads: 8, capacity: 10, joinDate: 'Jan 2026' },
  { id: 'p2', studioName: 'Studio Nord', contactPerson: 'David Chen', location: 'Islamabad, PK', status: 'Active', activeLeads: 12, capacity: 15, joinDate: 'Feb 2026' },
  { id: 'p3', studioName: 'Minimal Spaces Co.', contactPerson: 'Sarah Jenkins', location: 'Karachi, PK', status: 'Pending Review', activeLeads: 0, capacity: 5, joinDate: 'Oct 2026' },
  { id: 'p4', studioName: 'Heritage Designs', contactPerson: 'Ali Hassan', location: 'Lahore, PK', status: 'Suspended', activeLeads: 0, capacity: 0, joinDate: 'Mar 2025' }
];

interface PartnerStudiosTableProps {
  onOnboardClick: () => void;
}

export function PartnerStudiosTable({ onOnboardClick }: PartnerStudiosTableProps) {
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="w-3.5 h-3.5 text-green-600" />;
      case 'Pending Review': return <Clock className="w-3.5 h-3.5 text-yellow-600" />;
      case 'Suspended': return <AlertCircle className="w-3.5 h-3.5 text-red-600" />;
      default: return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-50 text-green-700 border-green-200';
      case 'Pending Review': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Suspended': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
      
      <div className="p-6 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#F4F2ED]/30">
        <div>
          <h2 className="font-display-xl text-xl text-primary tracking-tight">Verified Partner Studios</h2>
          <p className="font-body-md text-sm text-secondary mt-1">Manage network capacity and specialist onboarding.</p>
        </div>
        <button 
          onClick={onOnboardClick}
          className="bg-primary text-on-primary px-4 py-2 rounded font-label-sm text-[10px] uppercase tracking-widest hover:bg-surface-tint transition-colors shadow-sm whitespace-nowrap"
        >
          Onboard New Partner
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-[#FBF9F4]">
              <th className="p-4 font-label-sm text-[10px] uppercase tracking-widest text-secondary font-medium">Studio & Contact</th>
              <th className="p-4 font-label-sm text-[10px] uppercase tracking-widest text-secondary font-medium hidden md:table-cell">Location</th>
              <th className="p-4 font-label-sm text-[10px] uppercase tracking-widest text-secondary font-medium">Status</th>
              <th className="p-4 font-label-sm text-[10px] uppercase tracking-widest text-secondary font-medium hidden sm:table-cell">Capacity</th>
              <th className="p-4 font-label-sm text-[10px] uppercase tracking-widest text-secondary font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {MOCK_PARTNERS.map(partner => (
              <tr key={partner.id} className="hover:bg-[#F4F2ED]/50 transition-colors">
                <td className="p-4">
                  <div className="font-body-md text-sm text-primary font-semibold">{partner.studioName}</div>
                  <div className="font-label-sm text-[10px] text-secondary uppercase tracking-widest mt-1">{partner.contactPerson}</div>
                </td>
                <td className="p-4 hidden md:table-cell font-body-md text-sm text-secondary">
                  {partner.location}
                </td>
                <td className="p-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-label-sm text-[10px] uppercase tracking-widest ${getStatusClass(partner.status)}`}>
                    {getStatusIcon(partner.status)}
                    {partner.status}
                  </div>
                </td>
                <td className="p-4 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-[#EAE8E3] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${partner.activeLeads >= partner.capacity ? 'bg-red-500' : 'bg-primary'}`} 
                        style={{ width: `${partner.capacity > 0 ? (partner.activeLeads / partner.capacity) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="font-label-sm text-[10px] text-secondary">
                      {partner.activeLeads}/{partner.capacity}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button className="p-2 text-secondary hover:text-primary rounded hover:bg-[#F4F2ED] transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
