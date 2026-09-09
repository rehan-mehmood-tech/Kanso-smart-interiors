"use client";

import React from 'react';
import { AI_DESIGN_CONCEPTS, ROOM_ORIGINAL_WALLS } from '@/lib/constants/assets';
import { useParams } from 'next/navigation';
import { GeneratingLayout } from '@/components/generating/GeneratingLayout';
import { PulseIndicator } from '@/components/generating/PulseIndicator';
import { DynamicStatusTicker } from '@/components/generating/DynamicStatusTicker';
import { GenerationProgressBar } from '@/components/generating/GenerationProgressBar';
import { useAutoRedirect } from '@/components/generating/useAutoRedirect';

// Using the exact placeholder images from the Stitch HTML export
// Before and after must be visibly different images, or the reveal is a no-op.
const BG_EMPTY = ROOM_ORIGINAL_WALLS[0];
const BG_FINISHED = AI_DESIGN_CONCEPTS[1];

export default function GeneratingPage() {
  const params = useParams();
  const id = params.id as string;
  
  // Progress will linearly grow from 0 to 100 over 8000ms, then redirect
  const progress = useAutoRedirect(`/project/${id}/results`, 8000);

  return (
    <GeneratingLayout bgEmptyUrl={BG_EMPTY} bgFinishedUrl={BG_FINISHED} progress={progress}>
      <PulseIndicator />
      <h2 className="font-headline-lg text-4xl md:text-[40px] text-primary mb-6 mt-8 tracking-tight font-semibold">Architecting your vision...</h2>
      <DynamicStatusTicker />
      <GenerationProgressBar progress={progress} />
    </GeneratingLayout>
  );
}