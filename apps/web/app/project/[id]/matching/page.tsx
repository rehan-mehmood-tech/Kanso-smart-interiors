"use client";

import React, { Suspense } from 'react';
import { AI_DESIGN_CONCEPTS } from '@/lib/constants/assets';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { roomLabel, styleLabel } from '@/lib/project/catalog';
import { selectedDesign, useProject } from '@/lib/project/use-project';
import { MatchingLayout } from '@/components/matching/MatchingLayout';
import { RadarPulseGraphic } from '@/components/matching/RadarPulseGraphic';
import { MatchingStatusTicker } from '@/components/matching/MatchingStatusTicker';
import { useMatchingTimeoutRedirect } from '@/components/matching/useMatchingTimeoutRedirect';
import { MapPin, Palette, Ruler } from 'lucide-react';

/** Only until the project's own concept loads. */
const FALLBACK_BG = AI_DESIGN_CONCEPTS[3];

function MatchingContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  // The lead created by the booking form. The assignment already happened
  // server-side; this screen is the acknowledgement of it.
  const leadId = searchParams.get('lead');

  const { project } = useProject(id);
  const design = selectedDesign(project, searchParams.get('design'));

  // Wait ~6 seconds before routing to the success confirmation page
  useMatchingTimeoutRedirect(
    `/project/${id}/success${leadId ? `?lead=${encodeURIComponent(leadId)}` : ''}`,
    6000,
  );

  return (
    <MatchingLayout bgImageUrl={design?.signed_url ?? FALLBACK_BG}>
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
            <span className="font-body-md text-sm font-medium text-primary text-center">{styleLabel(project?.style_slug ?? null)}</span>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-surface-container-low rounded-lg border border-surface-container">
            <MapPin className="text-secondary w-6 h-6 mb-3" />
            <span className="font-label-sm text-xs text-secondary mb-1">Your Location</span>
            <span className="font-body-md text-sm font-medium text-primary text-center">{project?.city ?? 'Your city'}</span>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-surface-container-low rounded-lg border border-surface-container">
            <Ruler className="text-secondary w-6 h-6 mb-3" />
            <span className="font-label-sm text-xs text-secondary mb-1">Your Scope</span>
            <span className="font-body-md text-sm font-medium text-primary text-center">{roomLabel(project?.room_type ?? null)}</span>
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

export default function MatchingPage() {
  // useSearchParams needs a Suspense boundary in the App Router.
  return (
    <Suspense fallback={null}>
      <MatchingContent />
    </Suspense>
  );
}
