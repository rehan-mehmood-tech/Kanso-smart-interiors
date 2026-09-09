"use client";

import React from 'react';
import { AI_DESIGN_CONCEPTS, ROOM_ORIGINAL_WALLS } from '@/lib/constants/assets';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { GeneratingLayout } from '@/components/generating/GeneratingLayout';
import { PulseIndicator } from '@/components/generating/PulseIndicator';
import { DynamicStatusTicker } from '@/components/generating/DynamicStatusTicker';
import { GenerationProgressBar } from '@/components/generating/GenerationProgressBar';
import { useGenerationRun } from '@/components/generating/useGenerationRun';
import { roomLabel } from '@/lib/project/catalog';

/** Shown only until the project loads and its own first wall photo replaces it. */
const FALLBACK_EMPTY = ROOM_ORIGINAL_WALLS[0];
const BG_FINISHED = AI_DESIGN_CONCEPTS[1];

function GeneratingContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  // Set by the Regenerate action on the results page.
  const force = searchParams.get('force') === '1';

  // The bar now tracks a real POST /projects/:id/generate rather than a timer,
  // and the page advances only once concepts actually exist.
  const { progress, stage, project, error, retry } = useGenerationRun(id, force);

  // The "before" image is the customer's own north wall, so the crossfade
  // shows their actual room rather than a stock interior.
  const ownWall = project?.photos.find((photo) => photo.signed_url)?.signed_url;
  const room = roomLabel(project?.room_type ?? null);

  if (stage === 'error') {
    return (
      <GeneratingLayout bgEmptyUrl={ownWall ?? FALLBACK_EMPTY} bgFinishedUrl={BG_FINISHED} progress={0}>
        <AlertTriangle className="w-10 h-10 text-error mb-6" />
        <h2 className="font-headline-lg text-3xl md:text-4xl text-primary mb-4 tracking-tight font-semibold">
          We could not finish this render
        </h2>
        <p className="font-body-md text-base text-secondary max-w-[34rem] mb-8">{error}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={retry}
            className="bg-primary text-on-primary font-label-sm text-label-sm px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-surface-tint transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try again
          </button>
          <button
            onClick={() => router.push('/project/new/review')}
            className="font-label-sm text-label-sm px-6 py-3 rounded-lg border border-outline-variant text-secondary hover:text-primary hover:bg-surface-variant transition-colors"
          >
            Back to review
          </button>
        </div>
      </GeneratingLayout>
    );
  }

  return (
    <GeneratingLayout
      bgEmptyUrl={ownWall ?? FALLBACK_EMPTY}
      bgFinishedUrl={BG_FINISHED}
      progress={progress}
    >
      <PulseIndicator />
      <h2 className="font-headline-lg text-4xl md:text-[40px] text-primary mb-6 mt-8 tracking-tight font-semibold">
        Architecting your vision...
      </h2>
      <DynamicStatusTicker key={stage} stage={stage} roomLabel={room} />
      <GenerationProgressBar progress={progress} />
    </GeneratingLayout>
  );
}

export default function GeneratingPage() {
  // useSearchParams needs a Suspense boundary in the App Router.
  return (
    <Suspense fallback={null}>
      <GeneratingContent />
    </Suspense>
  );
}
