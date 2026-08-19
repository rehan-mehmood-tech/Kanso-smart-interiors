"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WizardProgressBar } from '@/components/wizard/WizardProgressBar';
import { CaptureGuidelines } from '@/components/wizard/capture/CaptureGuidelines';
import { CaptureGrid } from '@/components/wizard/capture/CaptureGrid';
import { WizardFooter } from '@/components/wizard/WizardFooter';

export default function CaptureSpacePage() {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleContinue = () => {
    if (isCompleted) {
      router.push('/project/new/style');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-[#F4F2ED]">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 max-w-[1440px] mx-auto bg-[#F4F2ED] border-b border-outline-variant/30">
        <div className="text-2xl font-bold tracking-tight text-primary cursor-pointer" onClick={() => router.push('/')}>
          Kanso
        </div>
        <div className="text-xs font-semibold text-secondary uppercase tracking-wider">
          Step 2 of 4
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-[100px] pb-[120px] px-6 md:px-12 max-w-[1280px] mx-auto w-full flex flex-col items-center">
        <div className="text-center max-w-2xl mx-auto mb-12 mt-6">
          <h1 className="text-3xl md:text-[40px] font-semibold text-primary mb-2 leading-tight tracking-[-0.01em]">Capture Your Space</h1>
          <p className="text-lg font-normal text-secondary">We'll use four views of your room to create a more complete visual concept.</p>
        </div>
        
        <CaptureGrid onCompletionChange={setIsCompleted} />
        
        <CaptureGuidelines />
      </main>

      <WizardFooter 
        onBack={() => router.push('/project/new/room-type')}
        onContinue={handleContinue}
        canContinue={isCompleted}
      />
    </div>
  );
}
