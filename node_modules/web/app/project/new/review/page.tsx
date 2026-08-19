"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { RoomSummaryCard } from '@/components/wizard/review/RoomSummaryCard';
import { PhotosSummaryCard } from '@/components/wizard/review/PhotosSummaryCard';
import { StyleSummaryCard } from '@/components/wizard/review/StyleSummaryCard';
import { GenerationDisclaimer } from '@/components/wizard/review/GenerationDisclaimer';
import { WizardFooter } from '@/components/wizard/WizardFooter';

export default function ReviewProjectPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [roomType, setRoomType] = useState('Living Room');
  const [styleName, setStyleName] = useState('Modern Grey');

  // Fallback photos for the mock presentation
  const mockPhotos = [
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85'
  ];

  useEffect(() => {
    // Read selections from URL if available
    const searchParams = new URLSearchParams(window.location.search);
    const room = searchParams.get('room');
    const style = searchParams.get('style');
    const customRoom = searchParams.get('custom');
    
    if (room) {
      setRoomType(room === 'other' && customRoom ? customRoom : room);
    }
    if (style) {
      setStyleName(style);
    }
  }, []);

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
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 max-w-[1440px] mx-auto bg-[#F4F2ED] border-b border-outline-variant/30">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push('/project/new/style' + window.location.search)}>
          <span className="material-symbols-outlined text-primary group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-body-md font-body-md text-primary hidden md:inline">Back</span>
        </div>
        <div className="text-2xl font-bold tracking-tight text-primary cursor-pointer absolute left-1/2 -translate-x-1/2" onClick={() => router.push('/')}>
          Kanso
        </div>
        <div className="text-xs font-semibold text-secondary uppercase tracking-wider">
          Step 4 of 4
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-[100px] pb-[120px] px-6 md:px-12 max-w-[768px] mx-auto w-full flex flex-col">
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
