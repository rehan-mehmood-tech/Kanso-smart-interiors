"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ScheduleHeader } from '@/components/pro/schedule/ScheduleHeader';
import { WeeklyCalendarView, CalendarDay, CalendarSlot } from '@/components/pro/schedule/WeeklyCalendarView';
import { UpcomingAppointmentsSidebar, Appointment } from '@/components/pro/schedule/UpcomingAppointmentsSidebar';
import { AvailabilityToggleModal } from '@/components/pro/schedule/AvailabilityToggleModal';

// Mock Data
const MOCK_DAYS: CalendarDay[] = [
  { date: '2026-10-12', dayName: 'Mon', isToday: false },
  { date: '2026-10-13', dayName: 'Tue', isToday: false },
  { date: '2026-10-14', dayName: 'Wed', isToday: true },
  { date: '2026-10-15', dayName: 'Thu', isToday: false },
  { date: '2026-10-16', dayName: 'Fri', isToday: false },
  { date: '2026-10-17', dayName: 'Sat', isToday: false },
  { date: '2026-10-18', dayName: 'Sun', isToday: false },
];

const MOCK_SLOTS: CalendarSlot[] = [
  { id: 's1', dayIdx: 0, timeIdx: 1, type: 'appointment', data: { clientName: 'Sarah Jenkins', format: 'Virtual' } },
  { id: 's2', dayIdx: 1, timeIdx: 4, type: 'appointment', data: { clientName: 'Michael Chen', format: 'On-site' } },
  { id: 's3', dayIdx: 2, timeIdx: 2, type: 'blocked' }, // Wednesday 11am blocked
  { id: 's4', dayIdx: 2, timeIdx: 3, type: 'blocked' }, // Wednesday 12pm blocked
  { id: 's5', dayIdx: 3, timeIdx: 6, type: 'appointment', data: { clientName: 'Elena Rossi', format: 'Virtual' } },
];

const MOCK_UPCOMING: Appointment[] = [
  { id: 'a1', leadId: 'lead-1', clientName: 'Sarah Jenkins', projectType: 'Living Room • Japandi', date: 'Monday, Oct 12', time: '10:00 AM', format: 'Virtual' },
  { id: 'a2', leadId: 'lead-2', clientName: 'Michael Chen', projectType: 'Master Suite • Minimalist', date: 'Tuesday, Oct 13', time: '01:00 PM', format: 'On-site' },
  { id: 'a3', leadId: 'lead-3', clientName: 'Elena Rossi', projectType: 'Home Office • Mid-Century', date: 'Thursday, Oct 15', time: '03:00 PM', format: 'Virtual' }
];

export default function ProSchedulePage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1B1C19] font-body-md flex flex-col relative overflow-hidden">
      
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-4 md:px-8 h-20 bg-[#FBF9F4]/90 backdrop-blur-md border-b border-outline-variant/30">
        <div className="flex items-center gap-6">
          <span className="font-display-xl text-2xl tracking-tighter text-primary">Kanso Pro</span>
          <nav className="hidden md:flex gap-6">
            <Link href="/pro/dashboard" className="text-secondary hover:text-primary transition-colors font-label-sm text-xs uppercase tracking-widest">Dashboard</Link>
            <Link href="/pro/profile" className="text-secondary hover:text-primary transition-colors font-label-sm text-xs uppercase tracking-widest">Profile</Link>
            <Link href="#" className="text-primary font-label-sm text-xs uppercase tracking-widest font-semibold border-b-2 border-primary pb-1">Schedule</Link>
          </nav>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#EAE8E3] overflow-hidden border border-outline-variant/30 shrink-0 flex items-center justify-center font-display-xl text-lg text-primary">
           ER
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full pt-28 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto">
        
        <Link href="/pro/dashboard" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors font-label-sm text-xs uppercase tracking-widest mb-6 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <ScheduleHeader 
          currentWeekLabel="Oct 12 - Oct 18, 2026"
          onPrevWeek={() => {}}
          onNextWeek={() => {}}
          onToday={() => {}}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8 flex-1 items-start min-h-0">
          
          {/* Calendar Grid (Takes up more space) */}
          <div className="xl:col-span-8 lg:col-span-8 flex flex-col h-[700px]">
            <WeeklyCalendarView days={MOCK_DAYS} slots={MOCK_SLOTS} />
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-4 lg:col-span-4 flex flex-col h-full md:h-[700px]">
            <UpcomingAppointmentsSidebar appointments={MOCK_UPCOMING} />
          </div>

        </div>

      </main>

      {/* Modals */}
      <AvailabilityToggleModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

    </div>
  );
}
