"use client";

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { SuccessHero } from '@/components/success/SuccessHero';
import { BookingSummaryCard, BookingSuccessSummary } from '@/components/success/BookingSummaryCard';
import { NextStepsTimeline } from '@/components/success/NextStepsTimeline';
import { SuccessActionButtons } from '@/components/success/SuccessActionButtons';
import { SiteHeader } from "@/components/layout/SiteHeader";
import { roomLabel, styleLabel } from '@/lib/project/catalog';
import { useProject } from '@/lib/project/use-project';
import { getConsultation, type ConsultationResult } from '@/lib/api/projects';
import { ApiError } from '@/lib/api/client';

function SuccessContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const leadId = searchParams.get('lead');

  const { project } = useProject(id);
  const [lead, setLead] = useState<ConsultationResult | null>(null);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [isLoadingLead, setIsLoadingLead] = useState(Boolean(leadId));

  const loadLead = useCallback(async () => {
    if (!leadId) return;
    setIsLoadingLead(true);
    setLeadError(null);
    try {
      setLead(await getConsultation(leadId));
    } catch (caught) {
      setLeadError(
        caught instanceof ApiError
          ? caught.message
          : 'We could not load your request details.',
      );
    } finally {
      setIsLoadingLead(false);
    }
  }, [leadId]);

  useEffect(() => {
    // Fetch on mount; every setState happens after an await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadLead();
  }, [loadLead]);

  // The partner shown is whoever the backend actually assigned. It used to be
  // a fixed name ("Elena Rossi, Senior Interior Architect") printed on every
  // confirmation, which told a customer whose lead had been queued that
  // someone was already handling it.
  const assigned = lead?.business ?? null;
  const summary: BookingSuccessSummary = {
    projectId: id,
    roomType: roomLabel(project?.room_type ?? null),
    style: styleLabel(project?.style_slug ?? null),
    location: project?.city ?? assigned?.city ?? 'Your area',
    partnerName: assigned?.name ?? 'Being matched',
    partnerRole: assigned?.trade
      ? assigned.trade.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : 'Our team is finding you a verified specialist',
    hasPartner: Boolean(assigned),
    message: lead?.message ?? null,
  };

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-[#FBF9F4] relative overflow-hidden">
      {/* Top Navbar */}
      <SiteHeader position="fixed" />

      {/* Ambient background texture */}
      <div
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 30%, #e6e2dc 0%, transparent 60%)' }}
      />

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-[100px] relative z-10 flex flex-col items-center justify-start px-4 md:px-8 w-full max-w-[800px] mx-auto">
        <SuccessHero />

        <div className="w-full">
          {isLoadingLead ? (
            <div className="flex items-center justify-center gap-3 py-16">
              <Loader2 className="w-5 h-5 text-secondary animate-spin" />
              <p className="text-body-md font-body-md text-secondary">Confirming your request...</p>
            </div>
          ) : (
            <>
              {leadError && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 mb-6"
                >
                  <AlertTriangle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <p className="text-body-md font-body-md text-secondary">
                    {leadError} Your request was submitted; this page just could not load its
                    details.
                  </p>
                </div>
              )}
              <BookingSummaryCard summary={summary} />
            </>
          )}
          <NextStepsTimeline />
          <SuccessActionButtons projectId={id} />
        </div>
      </main>
    </div>
  );
}

export default function SuccessPage() {
  // useSearchParams needs a Suspense boundary in the App Router.
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
