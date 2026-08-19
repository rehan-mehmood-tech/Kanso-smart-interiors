"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ResultsHeader } from '@/components/results/ResultsHeader';
import { ConceptCarousel, DesignConcept } from '@/components/results/ConceptCarousel';
import { MaterialPaletteBar, MaterialItem } from '@/components/results/MaterialPaletteBar';
import { ActionFloatingBar } from '@/components/results/ActionFloatingBar';

const MOCK_CONCEPTS: DesignConcept[] = [
  {
    id: 'concept-1',
    title: 'Concept A: The Serene Retreat',
    description: 'A highly realistic, wide-angle interior emphasizing Warm Minimalism. Soft natural light floods the space, highlighting natural textures and high-quality minimalist furniture. Designed for contemplation and calm.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
    features: ['Low-profile seating', 'Diffuse lighting', 'Organic shapes']
  },
  {
    id: 'concept-2',
    title: 'Concept B: Urban Zen',
    description: 'A darker, more introspective take using deep charcoals and raw stone elements to anchor the space. Monolithic coffee tables and moody architectural lighting set a curated, high-end tone.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
    features: ['Dark accents', 'Monolithic stone', 'Directional lighting']
  },
  {
    id: 'concept-3',
    title: 'Concept C: Raw Elements',
    description: 'Pushing the minimalist boundary with geometric light play. Expansive minimalist layouts utilizing textured white bouclé fabric and pale travertine.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
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
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 max-w-[1440px] mx-auto bg-[#F4F2ED]/90 backdrop-blur-sm border-b border-outline-variant/30">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push('/')}>
          <span className="material-symbols-outlined text-primary group-hover:-translate-x-1 transition-transform">close</span>
          <span className="text-body-md font-body-md text-primary hidden md:inline">Exit</span>
        </div>
        <div className="text-2xl font-bold tracking-tight text-primary cursor-pointer absolute left-1/2 -translate-x-1/2 font-display-xl" onClick={() => router.push('/')}>
          Kanso
        </div>
        <div className="text-sm font-semibold text-primary">
          Results
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-[80px] pb-[140px] px-4 md:px-12 max-w-[1024px] mx-auto w-full flex flex-col">
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