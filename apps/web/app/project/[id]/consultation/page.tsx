"use client";

import React, { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ConsultationHeader } from '@/components/consultation/ConsultationHeader';
import { SelectedProjectMiniCard } from '@/components/consultation/SelectedProjectMiniCard';
import { BookingForm } from '@/components/consultation/BookingForm';
import { PrivacyNotice } from '@/components/consultation/PrivacyNotice';
import { SiteHeader } from "@/components/layout/SiteHeader";
import { roomLabel, styleLabel } from '@/lib/project/catalog';
import { selectedDesign, useProject } from '@/lib/project/use-project';

function ConsultationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  // The concept chosen on the results page, carried through /selected.
  const designId = searchParams.get('design');

  const { project } = useProject(id);
  const design = selectedDesign(project, designId);

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-[#fbf9f4]">
      {/* Top Navbar */}
      <SiteHeader position="fixed" />

      {/* Single centered column -- no split layout, no side photography panel. */}
      <main className="flex-grow pt-24 pb-20">
        <section className="max-w-2xl mx-auto py-12 px-4">
          <ConsultationHeader />

          {/* Only rendered once the real concept is known. A placeholder here
              would be showing someone a room that is not theirs on the page
              where they hand over their phone number. */}
          {design?.signed_url && (
            <div className="mt-10">
              <SelectedProjectMiniCard
                imageUrl={design.signed_url}
                roomType={roomLabel(project?.room_type ?? null)}
                style={styleLabel(project?.style_slug ?? null)}
              />
            </div>
          )}

          <BookingForm projectId={id} defaultCity={project?.city ?? null} />
          <PrivacyNotice />
        </section>
      </main>
    </div>
  );
}

export default function ConsultationPage() {
  // useSearchParams needs a Suspense boundary in the App Router.
  return (
    <Suspense fallback={null}>
      <ConsultationContent />
    </Suspense>
  );
}
