"use client";

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { RoomSummaryCard } from '@/components/wizard/review/RoomSummaryCard';
import { PhotosSummaryCard } from '@/components/wizard/review/PhotosSummaryCard';
import { StyleSummaryCard } from '@/components/wizard/review/StyleSummaryCard';
import { GenerationDisclaimer } from '@/components/wizard/review/GenerationDisclaimer';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getRoomWallSet } from '@/lib/constants/assets';

function ReviewContent() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  // Derived from the URL rather than synced into state by an effect, which
  // caused a cascading render on every mount.
  const searchParams = useSearchParams();
  const room = searchParams.get('room');
  const style = searchParams.get('style');
  const customRoom = searchParams.get('custom');

  const roomType = room ? (room === 'other' && customRoom ? customRoom : room) : 'Living Room';
  const styleName = style ?? 'Modern Grey';

  // Fallback photos for the mock presentation
  const mockPhotos = getRoomWallSet('review-sample');

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      // For now, redirecting to a sample project ID
      router.push('/project/sample-project-id/generating');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-[#F4F2ED]">
      {/* Top Navbar */}
      <SiteHeader position="fixed" />

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-[120px] px-6 md:px-12 max-w-[768px] mx-auto w-full flex flex-col">
        {/* Headline */}
        <div className="text-center md:text-left pt-6 mb-10">
          <h1 className="text-3xl md:text-[40px] font-semibold text-primary mb-2 leading-tight tracking-[-0.01em]">Ready to see your room?</h1>
          <p className="text-lg font-normal text-secondary">Review your selections before we generate your concepts.</p>
        </div>

        {/* Review Summary Cards */}
        <div className="flex flex-col gap-6 mb-8">
          <RoomSummaryCard roomType={roomType} />
          <StyleSummaryCard styleName={styleName} />
          <PhotosSummaryCard photos={mockPhotos} />
        </div>

        <GenerationDisclaimer />
      </main>

      <WizardFooter 
        onBack={() => router.push('/project/new/style' + window.location.search)}
        onContinue={handleGenerate}
        canContinue={!isGenerating}
        isLoading={isGenerating}
        ctaText="Generate Concepts"
        ctaIcon={<Sparkles className="w-4 h-4" />}
      />
    </div>
  );
}

export default function ReviewProjectPage() {
  return (
    <Suspense fallback={null}>
      <ReviewContent />
    </Suspense>
  );
}
