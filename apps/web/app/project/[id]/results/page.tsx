"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ResultsHeader } from '@/components/results/ResultsHeader';
import { ConceptCarousel, DesignConcept } from '@/components/results/ConceptCarousel';
import { MaterialPaletteBar, MaterialItem } from '@/components/results/MaterialPaletteBar';
import { ActionFloatingBar } from '@/components/results/ActionFloatingBar';
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AI_DESIGN_CONCEPTS } from '@/lib/constants/assets';

const MOCK_CONCEPTS: DesignConcept[] = [
  {
    id: 'concept-1',
    title: 'Concept A: The Serene Retreat',
    description: 'A highly realistic, wide-angle interior emphasizing Warm Minimalism. Soft natural light floods the space, highlighting natural textures and high-quality minimalist furniture. Designed for contemplation and calm.',
    image: AI_DESIGN_CONCEPTS[0],
    features: ['Low-profile seating', 'Diffuse lighting', 'Organic shapes']
  },
  {
    id: 'concept-2',
    title: 'Concept B: Urban Zen',
    description: 'A darker, more introspective take using deep charcoals and raw stone elements to anchor the space. Monolithic coffee tables and moody architectural lighting set a curated, high-end tone.',
    image: AI_DESIGN_CONCEPTS[1],
    features: ['Dark accents', 'Monolithic stone', 'Directional lighting']
  },
  {
    id: 'concept-3',
    title: 'Concept C: Raw Elements',
    description: 'Pushing the minimalist boundary with geometric light play. Expansive minimalist layouts utilizing textured white bouclé fabric and pale travertine.',
    image: AI_DESIGN_CONCEPTS[2],
    features: ['Bouclé fabric', 'Travertine', 'High contrast']
  }
];

const MOCK_MATERIALS: MaterialItem[] = [
  { name: 'Fluted White Oak', color: '#D2B48C' },
  { name: 'Honed Travertine', color: '#E4D5B7' },
  { name: 'Bouclé Fabric', color: '#F5F5DC' },
  { name: 'Matte Black Steel', color: '#2F4F4F' }
];

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-[#F4F2ED]">
      {/* Top Navbar */}
      <SiteHeader position="fixed" />

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-[140px] px-4 md:px-12 max-w-[1024px] mx-auto w-full flex flex-col">
        <ResultsHeader 
          title="Living Room Concept Deck" 
          styleTag="Warm Minimalist" 
        />

        <ConceptCarousel 
          concepts={MOCK_CONCEPTS}
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
        />

        <MaterialPaletteBar materials={MOCK_MATERIALS} />
      </main>

      <ActionFloatingBar projectId={projectId} />
    </div>
  );
}