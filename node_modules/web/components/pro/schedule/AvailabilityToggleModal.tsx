"use client";

import React, { useState } from 'react';
import { X, Clock, ToggleLeft, ToggleRight } from 'lucide-react';

interface AvailabilityToggleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AvailabilityToggleModal({ isOpen, onClose }: AvailabilityToggleModalProps) {
  const [instantBooking, setInstantBooking] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex justify-end">
      {/* Drawer */}
      <div className="w-full max-w-[28rem] h-full bg-surface-container-lowest shadow-2xl border-l border-outline-variant/30 flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
          <h2 className="font-display-xl text-xl text-primary tracking-tight">Availability Settings</h2>
          <button 
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-[#F4F2ED]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-8">
          
          {/* Instant Booking Toggle */}
          <div className="bg-[#F4F2ED]/50 border border-outline-variant/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-body-md text-primary font-medium">Instant Booking</h3>
              <button 
                onClick={() => setInstantBooking(!instantBooking)}
                className="text-primary focus:outline-none"
              >
                {instantBooking ? <ToggleRight className="w-8 h-8 text-green-600" /> : <ToggleLeft className="w-8 h-8 text-secondary" />}
              </button>
            </div>
            <p className="font-body-md text-sm text-secondary leading-relaxed">
              Allow verified homeowners to book available slots automatically without requiring manual approval.
            </p>
          </div>

          {/* Standard Hours */}
          <div>
            <h3 className="font-display-xl text-lg text-primary tracking-tight mb-4">Standard Working Hours</h3>
            <div className="space-y-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                <div key={day} className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0">
                  <span className="font-body-md text-sm text-primary w-24">{day}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <select className="bg-[#F4F2ED] border border-outline-variant/50 rounded px-2 py-1 font-body-md text-xs text-primary focus:ring-1 focus:ring-primary flex-1">
                      <option>09:00 AM</option>
                      <option>10:00 AM</option>
                    </select>
                    <span className="text-secondary text-xs">-</span>
                    <select className="bg-[#F4F2ED] border border-outline-variant/50 rounded px-2 py-1 font-body-md text-xs text-primary focus:ring-1 focus:ring-primary flex-1">
                      <option>05:00 PM</option>
                      <option>06:00 PM</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Block Time */}
          <div>
            <h3 className="font-display-xl text-lg text-primary tracking-tight mb-4">Block Time Off</h3>
            <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-4 shadow-sm flex flex-col gap-4">
               <div className="flex gap-4">
                 <input type="date" className="bg-[#F4F2ED] border border-outline-variant/50 rounded px-3 py-2 font-body-md text-xs text-primary flex-1" />
                 <input type="date" className="bg-[#F4F2ED] border border-outline-variant/50 rounded px-3 py-2 font-body-md text-xs text-primary flex-1" />
               </div>
               <button className="w-full bg-[#EAE8E3] text-primary border border-outline-variant/50 px-4 py-2 rounded font-label-sm text-[10px] uppercase tracking-widest hover:bg-[#F4F2ED] transition-colors shadow-sm">
                 Add Blocked Period
               </button>
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-outline-variant/30 bg-[#F4F2ED]/50">
          <button 
            onClick={onClose}
            className="w-full bg-primary text-on-primary py-3 rounded font-label-sm text-xs uppercase tracking-widest hover:bg-surface-tint transition-colors shadow-sm"
          >
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  );
}
