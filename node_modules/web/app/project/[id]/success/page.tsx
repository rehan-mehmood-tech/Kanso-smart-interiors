import React from 'react';
import { SuccessHero } from '@/components/success/SuccessHero';
import { BookingSummaryCard, BookingSuccessSummary } from '@/components/success/BookingSummaryCard';
import { NextStepsTimeline } from '@/components/success/NextStepsTimeline';
import { SuccessActionButtons } from '@/components/success/SuccessActionButtons';
import Link from 'next/link';
import { SiteHeader } from "@/components/layout/SiteHeader";

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
      <SiteHeader position="fixed" />

      {/* Ambient background texture */}
      <div 
        className="absolute inset-0 z-0 opacity-30 pointer-events-none" 
        style={{ background: 'radial-gradient(circle at 50% 30%, #e6e2dc 0%, transparent 60%)' }} 
      />

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-[100px] relative z-10 flex flex-col items-center justify-start px-4 md:px-8 w-full max-w-[800px] mx-auto">
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
