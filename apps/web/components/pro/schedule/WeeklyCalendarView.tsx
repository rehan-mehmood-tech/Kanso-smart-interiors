"use client";

import React from 'react';
import { EmptySlotCard } from './EmptySlotCard';

export interface CalendarDay {
  date: string;
  dayName: string;
  isToday: boolean;
}

export interface CalendarSlot {
  id: string;
  dayIdx: number; // 0-6
  timeIdx: number; // 0-8 (9am to 5pm)
  type: 'appointment' | 'blocked' | 'empty';
  data?: {
    clientName?: string;
    format?: 'Virtual' | 'On-site';
  }
}

interface WeeklyCalendarViewProps {
  days: CalendarDay[];
  slots: CalendarSlot[];
}

const HOURS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

export function WeeklyCalendarView({ days, slots }: WeeklyCalendarViewProps) {
  
  const getSlotForPosition = (dayIdx: number, timeIdx: number) => {
    return slots.find(s => s.dayIdx === dayIdx && s.timeIdx === timeIdx);
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full">
      
      {/* Calendar Header (Days) */}
      <div className="flex border-b border-outline-variant/30 bg-[#F4F2ED]/50">
        <div className="w-20 shrink-0 border-r border-outline-variant/30 flex items-center justify-center">
          <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary">GMT+5</span>
        </div>
        <div className="flex-1 grid grid-cols-5 md:grid-cols-7 divide-x divide-outline-variant/30">
          {days.map((day, idx) => (
            <div key={idx} className={`flex flex-col items-center justify-center py-3 md:py-4 ${idx > 4 ? 'hidden md:flex bg-surface-container-low/30' : ''}`}>
              <span className={`font-label-sm text-[10px] uppercase tracking-widest mb-1 ${day.isToday ? 'text-primary font-bold' : 'text-secondary'}`}>
                {day.dayName}
              </span>
              <span className={`font-display-xl text-lg md:text-xl leading-none ${day.isToday ? 'text-primary bg-[#EAE8E3] w-8 h-8 rounded-full flex items-center justify-center' : 'text-primary'}`}>
                {day.date.split('-')[2]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Body (Grid) */}
      <div className="flex-1 overflow-y-auto min-h-[500px]">
        <div className="flex relative">
          
          {/* Time Labels */}
          <div className="w-20 shrink-0 border-r border-outline-variant/30 bg-surface-container-lowest z-10 flex flex-col">
            {HOURS.map((hour, hIdx) => (
              <div key={hIdx} className="h-24 relative border-b border-outline-variant/20 flex items-start justify-center pt-2">
                <span className="font-label-sm text-[10px] text-secondary">{hour}</span>
              </div>
            ))}
          </div>

          {/* Grid Area */}
          <div className="flex-1 grid grid-cols-5 md:grid-cols-7 divide-x divide-outline-variant/20 bg-[#FBF9F4]">
            {days.map((day, dIdx) => (
              <div key={dIdx} className={`flex flex-col divide-y divide-outline-variant/20 ${dIdx > 4 ? 'hidden md:flex bg-surface-container-low/20' : ''}`}>
                {HOURS.map((_, hIdx) => {
                  const slot = getSlotForPosition(dIdx, hIdx);
                  
                  return (
                    <div key={hIdx} className="h-24 p-1 relative">
                      {slot ? (
                        slot.type === 'appointment' ? (
                          <div className={`w-full h-full rounded-lg border p-2 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow ${slot.data?.format === 'Virtual' ? 'bg-blue-50 border-blue-200' : 'bg-purple-50 border-purple-200'}`}>
                            <span className={`font-label-sm text-[9px] uppercase tracking-widest ${slot.data?.format === 'Virtual' ? 'text-blue-700' : 'text-purple-700'}`}>
                              {slot.data?.format}
                            </span>
                            <span className="font-body-md text-xs text-primary font-medium leading-tight line-clamp-2">
                              {slot.data?.clientName}
                            </span>
                          </div>
                        ) : slot.type === 'blocked' ? (
                          <div className="w-full h-full bg-[#EAE8E3]/50 rounded-lg border border-outline-variant/30 flex items-center justify-center pattern-diagonal-lines pattern-outline-variant/20 pattern-bg-transparent pattern-size-4">
                            <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary bg-[#F4F2ED] px-2 py-0.5 rounded shadow-sm">Blocked</span>
                          </div>
                        ) : (
                          <EmptySlotCard time={HOURS[hIdx]} />
                        )
                      ) : (
                        <EmptySlotCard time={HOURS[hIdx]} />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
