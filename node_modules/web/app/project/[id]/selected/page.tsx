"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ConfirmationBanner } from '@/components/selected/ConfirmationBanner';
import { DesignSpecSheet, SpecItem } from '@/components/selected/DesignSpecSheet';
import { DownloadProposalButton } from '@/components/selected/DownloadProposalButton';
import { ConsultationCTASection } from '@/components/selected/ConsultationCTASection';
import { SecondaryNavActions } from '@/components/selected/SecondaryNavActions';
import { SiteHeader } from "@/components/layout/SiteHeader";

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
      <SiteHeader position="fixed" />

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-[80px] px-4 md:px-12 max-w-[1024px] mx-auto w-full flex flex-col">
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