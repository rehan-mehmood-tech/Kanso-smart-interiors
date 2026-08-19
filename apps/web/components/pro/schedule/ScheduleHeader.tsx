"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, Globe, Settings } from 'lucide-react';

interface ScheduleHeaderProps {
  currentWeekLabel: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  onSettingsClick: () => void;
}

export function ScheduleHeader({ 
  currentWeekLabel, 
  onPrevWeek, 
  onNextWeek, 
  onToday,
  onSettingsClick
}: ScheduleHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-4">
        <h1 className="font-display-xl text-2xl md:text-3xl text-primary tracking-tight">{currentWeekLabel}</h1>
        <div className="hidden sm:flex items-center gap-2 text-secondary bg-[#F4F2ED] px-3 py-1.5 rounded border border-outline-variant/30 shadow-sm">
          <Globe className="w-4 h-4" />
          <span className="font-label-sm text-[10px] uppercase tracking-widest">GMT+5 (Islamabad)</span>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        <div className="flex items-center gap-2">
          <button 
            onClick={onPrevWeek}
            className="p-2 bg-[#F4F2ED] text-secondary hover:text-primary hover:bg-[#EAE8E3] rounded border border-outline-variant/30 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={onToday}
            className="px-4 py-2 font-label-sm text-[10px] uppercase tracking-widest text-primary border border-outline-variant/50 rounded hover:bg-[#F4F2ED] transition-colors shadow-sm"
          >
            Today
          </button>
          <button 
            onClick={onNextWeek}
            className="p-2 bg-[#F4F2ED] text-secondary hover:text-primary hover:bg-[#EAE8E3] rounded border border-outline-variant/30 transition-colors shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button 
          onClick={onSettingsClick}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded font-label-sm text-[10px] uppercase tracking-widest hover:bg-surface-tint transition-colors shadow-sm"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Availability Settings</span>
        </button>
      </div>
    </div>
  );
}
