"use client";

import React from 'react';
import { AI_DESIGN_CONCEPTS } from '@/lib/constants/assets';
import { useParams, useRouter } from 'next/navigation';
import { MatchingLayout } from '@/components/matching/MatchingLayout';
import { RadarPulseGraphic } from '@/components/matching/RadarPulseGraphic';
import { MatchingStatusTicker } from '@/components/matching/MatchingStatusTicker';
import { useMatchingTimeoutRedirect } from '@/components/matching/useMatchingTimeoutRedirect';
import { MapPin, Palette, Ruler } from 'lucide-react';

const BG_IMAGE = AI_DESIGN_CONCEPTS[3];

export default function MatchingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  // Wait ~6 seconds before routing to the success confirmation page
  useMatchingTimeoutRedirect(`/project/${id}/success`, 6000);

  return (
    <MatchingLayout bgImageUrl={BG_IMAGE}>
      <RadarPulseGraphic />
      <MatchingStatusTicker />

      {/* Matching Criteria Card (Glassmorphism/Minimalist) */}
      <div className="bg-surface-container-lowest/80 backdrop-blur-md rounded-xl p-8 md:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant/50 w-full max-w-2xl">
        <h2 className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-8 text-center">
          Matching based on
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="flex flex-col items-center p-6 bg-surface-container-low rounded-lg border border-surface-container">
            <Palette className="text-secondary w-6 h-6 mb-3" />
            <span className="font-label-sm text-xs text-secondary mb-1">Your Style</span>
            <span className="font-body-md text-sm font-medium text-primary text-center">Warm Minimalist</span>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-surface-container-low rounded-lg border border-surface-container">
            <MapPin className="text-secondary w-6 h-6 mb-3" />
            <span className="font-label-sm text-xs text-secondary mb-1">Your Location</span>
            <span className="font-body-md text-sm font-medium text-primary text-center">Lahore, PK</span>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-surface-container-low rounded-lg border border-surface-container">
            <Ruler className="text-secondary w-6 h-6 mb-3" />
            <span className="font-label-sm text-xs text-secondary mb-1">Your Scope</span>
            <span className="font-body-md text-sm font-medium text-primary text-center">Living Room Remodel</span>
          </div>

        </div>

        {/* Progress indication bar */}
        <div className="mt-12 h-1 w-full bg-surface-container rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full w-1/3 animate-[matching-progress_2s_ease-in-out_infinite_alternate]" />
        </div>
      </div>

      {/* Cancel Action */}
      <div className="mt-12">
        <button 
          onClick={() => router.push(`/project/${id}/consultation`)}
          className="font-label-sm text-xs text-secondary hover:text-primary transition-colors duration-300 uppercase tracking-widest"
        >
          Cancel Search
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes matching-progress {
            0% { width: 10%; transform: translateX(0); }
            100% { width: 30%; transform: translateX(230%); }
        }
      `}} />
    </MatchingLayout>
  );
}
