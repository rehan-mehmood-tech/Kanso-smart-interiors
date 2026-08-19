import React from 'react';
import { SuccessHero } from '@/components/success/SuccessHero';
import { BookingSummaryCard, BookingSuccessSummary } from '@/components/success/BookingSummaryCard';
import { NextStepsTimeline } from '@/components/success/NextStepsTimeline';
import { SuccessActionButtons } from '@/components/success/SuccessActionButtons';
import Link from 'next/link';

interface SuccessPageProps {
  params: Promise<{ id: string }>;
}

export default async function SuccessPage({ params }: SuccessPageProps) {
  const { id } = await params;

  // Mock data representing the booked state
  const summaryData: BookingSuccessSummary = {
    projectId: id,
    roomType: 'Living Room',
    style: 'Warm Minimalist',
    contactWindow: 'Morning (9am - 12pm)',
    location: 'Lahore, PK',
    partnerName: 'Elena Rossi',
    partnerRole: 'Senior Interior Architect'
  };

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-[#FBF9F4] relative overflow-hidden">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 max-w-[1440px] mx-auto bg-[#FBF9F4]/80 backdrop-blur-md border-b border-outline-variant/30">
        <div className="w-12" /> {/* Spacer for centering */}
        <div className="text-2xl font-bold tracking-tight text-primary font-display-xl">
          <Link href="/">Kanso</Link>
        </div>
        <div className="w-12 flex justify-end">
          <Link href="/dashboard" className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-primary">close</span>
          </Link>
        </div>
      </header>

      {/* Ambient background texture */}
      <div 
        className="absolute inset-0 z-0 opacity-30 pointer-events-none" 
        style={{ background: 'radial-gradient(circle at 50% 30%, #e6e2dc 0%, transparent 60%)' }} 
      />

      {/* Main Content */}
      <main className="flex-grow pt-[140px] pb-[100px] relative z-10 flex flex-col items-center justify-start px-4 md:px-8 w-full max-w-[800px] mx-auto">
        <SuccessHero />
        
        <div className="w-full">
          <BookingSummaryCard summary={summaryData} />
          <NextStepsTimeline />
          <SuccessActionButtons projectId={id} />
        </div>
      </main>
    </div>
  );
}
