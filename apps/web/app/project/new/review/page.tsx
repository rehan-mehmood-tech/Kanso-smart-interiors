"use client";

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, Camera, Sparkles } from 'lucide-react';
import { RoomSummaryCard } from '@/components/wizard/review/RoomSummaryCard';
import { PhotosSummaryCard } from '@/components/wizard/review/PhotosSummaryCard';
import { StyleSummaryCard } from '@/components/wizard/review/StyleSummaryCard';
import { GenerationDisclaimer } from '@/components/wizard/review/GenerationDisclaimer';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { SiteHeader } from "@/components/layout/SiteHeader";
import { budgetLabel, budgetToPkr, roomLabel, styleLabel } from '@/lib/project/catalog';
import {
  capturedPreviews,
  hasAllWalls,
  pendingUploads,
  setProjectId,
  useWizard,
} from '@/lib/project/session';
import { createProject, uploadWallPhoto } from '@/lib/api/projects';
import { ApiError } from '@/lib/api/client';

function ReviewContent() {
  const router = useRouter();
  const wizard = useWizard();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressNote, setProgressNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // The store is the source of truth. The query string is only a fallback for
  // a step opened directly by URL, before any selection has been made here.
  const searchParams = useSearchParams();
  const roomId = wizard.roomId ?? searchParams.get('room');
  const styleId = wizard.styleId ?? searchParams.get('style');
  const budgetId = wizard.budgetTierId ?? searchParams.get('budget');
  const customRoom = wizard.customRoom ?? searchParams.get('custom');

  const roomTitle = roomLabel(roomId, customRoom);
  const styleTitle = styleLabel(styleId);

  // The customer's own four wall photos, exactly as captured.
  const photos = capturedPreviews(wizard);
  const photosReady = hasAllWalls(wizard);

  const handleGenerate = async () => {
    if (!photosReady) {
      setError('Your four wall photos are needed before we can generate concepts.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 1. Create the real project. Its UUID is what every later route uses --
      //    there is no placeholder id anywhere in this flow.
      setProgressNote('Creating your project...');
      const project = await createProject({
        room_type: roomId ?? undefined,
        style_slug: styleId ?? undefined,
        budget_pkr: budgetToPkr(budgetId),
      });
      setProjectId(project.id);

      // 2. Upload the four walls. Sequential rather than parallel: each upload
      //    advances the project's status server-side, and four concurrent
      //    writes to the same row race each other.
      const uploads = pendingUploads(wizard);
      for (let i = 0; i < uploads.length; i += 1) {
        const { angle, file } = uploads[i];
        setProgressNote(`Uploading wall ${i + 1} of ${uploads.length}...`);
        await uploadWallPhoto(project.id, angle, file);
      }

      // 3. Hand off to the real project route.
      router.push(`/project/${project.id}/generating`);
    } catch (caught) {
      // A session that expired between opening this page and pressing the
      // button. The middleware cannot catch that -- it only runs on navigation
      // -- so send them to log in and come straight back here.
      if (caught instanceof ApiError && caught.status === 401) {
        const here = `${window.location.pathname}${window.location.search}`;
        router.push(`/login?next=${encodeURIComponent(here)}`);
        return;
      }

      const message =
        caught instanceof ApiError
          ? caught.message
          : 'We could not reach the design service. Please try again.';
      setError(message);
      setIsGenerating(false);
      setProgressNote(null);
    }
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
          <RoomSummaryCard roomType={roomTitle} />
          <StyleSummaryCard styleName={styleTitle} budgetName={budgetLabel(budgetId)} />
          {photosReady ? (
            <PhotosSummaryCard photos={photos} />
          ) : (
            <MissingPhotosCard
              count={photos.length}
              onCapture={() => router.push('/project/new/capture')}
            />
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-error/40 bg-error/5 p-4 mb-8"
          >
            <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
            <p className="text-body-md font-body-md text-primary">{error}</p>
          </div>
        )}

        <GenerationDisclaimer />
      </main>

      <WizardFooter
        onBack={() => router.push('/project/new/style' + window.location.search)}
        onContinue={handleGenerate}
        canContinue={!isGenerating && photosReady}
        isLoading={isGenerating}
        ctaText={progressNote ?? 'Generate Concepts'}
        ctaIcon={<Sparkles className="w-4 h-4" />}
      />
    </div>
  );
}

/**
 * Shown when the wall photos are gone.
 *
 * Files cannot be persisted across a full page reload, so a refreshed review
 * step has the customer's selections but not their photos. Saying so and
 * offering the way back is honest; generating from stock images would not be.
 */
function MissingPhotosCard({ count, onCapture }: { count: number; onCapture: () => void }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.04)] border border-outline-variant flex flex-col gap-4">
      <h3 className="text-label-sm font-label-sm text-secondary uppercase tracking-wider">Uploaded Photos</h3>
      <div className="flex items-start gap-3">
        <Camera className="w-5 h-5 text-secondary shrink-0 mt-1" />
        <p className="text-body-md font-body-md text-secondary">
          {count > 0
            ? `Only ${count} of 4 walls are captured. All four views are needed to read the room.`
            : 'Your wall photos are no longer in this session. Please capture the four views again.'}
        </p>
      </div>
      <button
        onClick={onCapture}
        className="w-fit text-label-sm font-label-sm text-primary underline hover:text-secondary transition-colors"
      >
        Capture photos
      </button>
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
