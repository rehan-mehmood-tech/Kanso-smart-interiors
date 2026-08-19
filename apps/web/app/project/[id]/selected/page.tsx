"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ConfirmationBanner } from '@/components/selected/ConfirmationBanner';
import { DesignSpecSheet, SpecItem } from '@/components/selected/DesignSpecSheet';
import { DownloadProposalButton } from '@/components/selected/DownloadProposalButton';
import { ConsultationCTASection } from '@/components/selected/ConsultationCTASection';
import { SecondaryNavActions } from '@/components/selected/SecondaryNavActions';

// Mock Data representing the chosen concept
const SELECTED_IMAGE = 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85';

const SPEC_DATA: SpecItem[] = [
  {
    category: 'Color Palette & Lighting',
    items: [
      'Warm Bone White (#FBF9F4) base walls',
      'Matte Charcoal (#1B1C19) accent framing',
      'Diffused perimeter cove lighting (3000K)',
      'Directional spotlighting on key architectural features'
    ]
  },
  {
    category: 'Key Furniture & Materials',
    items: [
      'Low-profile modular sofa in textured Linen Bouclé',
      'Monolithic coffee table in Honed Travertine',
      'Fluted White Oak built-in joinery',
      'Matte Black steel window mullions'
    ]
  },
  {
    category: 'Estimated Scope & Footprint',
    items: [
      'Room Footprint: Approx. 450 sq. ft.',
      'Sourcing Timeline: 6-8 weeks for bespoke items',
      'Contractor Requirement: Light structural (paint & lighting)',
      'Project Tier: Full Furnishing'
    ]
  }
];

export default function ProjectSelectedPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-[#F4F2ED]">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 max-w-[1440px] mx-auto bg-[#F4F2ED]/90 backdrop-blur-sm border-b border-outline-variant/30">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push(`/project/${projectId}/results`)}>
          <span className="material-symbols-outlined text-primary group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-body-md font-body-md text-primary hidden md:inline">Back</span>
        </div>
        <div className="text-2xl font-bold tracking-tight text-primary cursor-pointer absolute left-1/2 -translate-x-1/2 font-display-xl" onClick={() => router.push('/')}>
          Kanso
        </div>
        <div className="text-sm font-semibold text-primary">
          Design Locked
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-[80px] pb-[80px] px-4 md:px-12 max-w-[1024px] mx-auto w-full flex flex-col">
        <ConfirmationBanner imageUrl={SELECTED_IMAGE} />

        <div className="flex justify-end mb-4">
          <DownloadProposalButton />
        </div>

        <DesignSpecSheet 
          description="Calm, grounding, and expansive. The layout prioritizes negative space, allowing high-quality materials to dictate the room's character without visual clutter. This approach harmonizes natural light with tactile surfaces."
          specs={SPEC_DATA}
        />

        <ConsultationCTASection projectId={projectId} />

        <SecondaryNavActions projectId={projectId} />
      </main>
    </div>
  );
}