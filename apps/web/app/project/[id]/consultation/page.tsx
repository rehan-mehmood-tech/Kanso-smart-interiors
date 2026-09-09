import React from 'react';
import { getUniqueAsset } from '@/lib/constants/assets';
import { ConsultationHeader } from '@/components/consultation/ConsultationHeader';
import { SelectedProjectMiniCard } from '@/components/consultation/SelectedProjectMiniCard';
import { BookingForm } from '@/components/consultation/BookingForm';
import { PrivacyNotice } from '@/components/consultation/PrivacyNotice';
import { SiteHeader } from "@/components/layout/SiteHeader";

interface ConsultationPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConsultationPage({ params }: ConsultationPageProps) {
  const { id } = await params;
  // Keyed to the project, so two projects never show the same concept.
  const selectedImage = getUniqueAsset('concepts', id);

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-[#fbf9f4]">
      {/* Top Navbar */}
      <SiteHeader position="fixed" />

      {/* Single centered column -- no split layout, no side photography panel. */}
      <main className="flex-grow pt-24 pb-20">
        <section className="max-w-2xl mx-auto py-12 px-4">
          <ConsultationHeader />

          <div className="mt-10">
            <SelectedProjectMiniCard
              imageUrl={selectedImage}
              roomType="Living Room"
              style="Warm Minimalist"
            />
          </div>

          <BookingForm projectId={id} />
          <PrivacyNotice />
        </section>
      </main>
    </div>
  );
}
