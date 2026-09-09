"use client";

import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ConsultationCTASectionProps {
  projectId: string;
  /** Chosen concept, carried on so the booking page shows the same image. */
  designId?: string;
}

export function ConsultationCTASection({ projectId, designId }: ConsultationCTASectionProps) {
  const router = useRouter();

  return (
    <div className="bg-surface-container rounded-xl p-8 md:p-12 border border-outline-variant/50 text-center flex flex-col items-center mb-12">
      <Calendar className="w-10 h-10 text-primary mb-4" />
      <h2 className="text-2xl md:text-3xl font-display-xl text-primary mb-3">Ready to Make It Real?</h2>
      <p className="text-body-md font-body-md text-secondary max-w-[32rem] mb-8">
        Review this concept with a dedicated Kanso specialist. We&rsquo;ll refine the materials, map out exact dimensions, and finalize the procurement process.
      </p>
      
      <button 
        onClick={() =>
          router.push(
            `/project/${projectId}/consultation${designId ? `?design=${encodeURIComponent(designId)}` : ''}`,
          )
        }
        className="bg-primary text-on-primary font-label-sm text-label-sm rounded-lg px-8 py-4 hover:bg-surface-tint transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full md:w-auto"
      >
        Request Specialist Consultation
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
