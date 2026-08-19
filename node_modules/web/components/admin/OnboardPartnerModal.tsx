"use client";

import React, { useState } from 'react';
import { X, Building, MapPin, Palette } from 'lucide-react';

interface OnboardPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardPartnerModal({ isOpen, onClose }: OnboardPartnerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex justify-end">
      {/* Drawer */}
      <div className="w-full max-w-lg h-full bg-surface-container-lowest shadow-2xl border-l border-outline-variant/30 flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30 bg-[#F4F2ED]/50">
          <div>
            <h2 className="font-display-xl text-xl text-primary tracking-tight mb-1">Onboard New Partner</h2>
            <p className="font-label-sm text-[10px] uppercase tracking-widest text-secondary">Studio Verification & Intake</p>
          </div>
          <button 
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-[#EAE8E3]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          
          {/* Section 1: Business Details */}
          <section>
            <h3 className="flex items-center gap-2 font-display-xl text-lg text-primary tracking-tight mb-4 border-b border-outline-variant/30 pb-2">
              <Building className="w-4 h-4" /> Business Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-label-sm text-[10px] uppercase tracking-widest text-secondary mb-1">Studio Name</label>
                <input type="text" className="w-full bg-[#F4F2ED] border border-outline-variant/50 rounded px-3 py-2 font-body-md text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="e.g. Rossi Architecture" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-[10px] uppercase tracking-widest text-secondary mb-1">Primary Contact</label>
                  <input type="text" className="w-full bg-[#F4F2ED] border border-outline-variant/50 rounded px-3 py-2 font-body-md text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Full Name" />
                </div>
                <div>
                  <label className="block font-label-sm text-[10px] uppercase tracking-widest text-secondary mb-1">Contact Email</label>
                  <input type="email" className="w-full bg-[#F4F2ED] border border-outline-variant/50 rounded px-3 py-2 font-body-md text-sm focus:ring-1 focus:ring-primary focus:border-primary" placeholder="email@studio.com" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Coverage */}
          <section>
            <h3 className="flex items-center gap-2 font-display-xl text-lg text-primary tracking-tight mb-4 border-b border-outline-variant/30 pb-2">
              <MapPin className="w-4 h-4" /> Operational Coverage
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-label-sm text-[10px] uppercase tracking-widest text-secondary mb-2">City / Region (Multi-Select)</label>
                <select multiple className="w-full bg-[#F4F2ED] border border-outline-variant/50 rounded px-3 py-2 font-body-md text-sm focus:ring-1 focus:ring-primary h-24">
                  <option>Lahore, PK</option>
                  <option>Karachi, PK</option>
                  <option>Islamabad, PK</option>
                  <option>Dubai, UAE</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 3: Specialization & Capacity */}
          <section>
            <h3 className="flex items-center gap-2 font-display-xl text-lg text-primary tracking-tight mb-4 border-b border-outline-variant/30 pb-2">
              <Palette className="w-4 h-4" /> Expertise & Capacity
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-label-sm text-[10px] uppercase tracking-widest text-secondary mb-2">Style Specializations</label>
                <div className="flex flex-wrap gap-2">
                  {['Japandi', 'Warm Minimalist', 'Quiet Luxury', 'Mid-Century', 'Modern Organic'].map(style => (
                    <label key={style} className="flex items-center gap-2 bg-[#FBF9F4] border border-outline-variant/50 px-3 py-1.5 rounded cursor-pointer hover:bg-[#F4F2ED]">
                      <input type="checkbox" className="text-primary focus:ring-primary border-outline-variant rounded-sm" />
                      <span className="font-label-sm text-[10px] uppercase tracking-widest text-primary">{style}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block font-label-sm text-[10px] uppercase tracking-widest text-secondary mb-1">Initial Lead Allocation Quota (Monthly)</label>
                <input type="number" className="w-full bg-[#F4F2ED] border border-outline-variant/50 rounded px-3 py-2 font-body-md text-sm focus:ring-1 focus:ring-primary w-32" defaultValue={5} />
              </div>
            </div>
          </section>

        </div>

        <div className="p-6 border-t border-outline-variant/30 bg-[#F4F2ED]/50 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 bg-surface-container-lowest border border-outline-variant/50 text-primary py-3 rounded font-label-sm text-xs uppercase tracking-widest hover:bg-[#EAE8E3] transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button 
            className="flex-1 bg-primary text-on-primary py-3 rounded font-label-sm text-xs uppercase tracking-widest hover:bg-surface-tint transition-colors shadow-sm"
          >
            Create Partner
          </button>
        </div>

      </div>
    </div>
  );
}
