"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WizardProgressBar } from '@/components/wizard/WizardProgressBar';
import { StyleGrid } from '@/components/wizard/style/StyleGrid';
import { BudgetScopeSelector, BudgetTier } from '@/components/wizard/style/BudgetScopeSelector';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { SiteHeader } from "@/components/layout/SiteHeader";

const STYLE_OPTIONS = [
  {
    id: 'modern',
    title: 'Modern',
    description: 'Clean lines, neutral palette, and functional elegance.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
    palettes: ['#E6E2DC', '#C8C6C5', '#30312E', '#1C1B1B'],
    materials: ['Black Metal', 'Concrete']
  },
  {
    id: 'minimal',
    title: 'Minimal',
    description: 'Intentional simplicity emphasizing space and light.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85',
    palettes: ['#FFFFFF', '#F5F3EE', '#DCDAD5', '#1B1C19'],
    materials: ['Light Oak', 'Plaster']
  },
  {
    id: 'scandinavian',
    title: 'Scandinavian',
    description: 'Hygge comfort blended with bright, functional design.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85',
    palettes: ['#FBF9F4', '#EAE8E3', '#8B8376', '#4D463B'],
    materials: ['Pale Wood', 'Wool']
  },
  {
    id: 'grey',
    title: 'Grey',
    description: 'Sophisticated monochromatic layers for a calm atmosphere.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
    palettes: ['#E4E2DD', '#C4C7C7', '#747878', '#444748'],
    materials: ['Velvet', 'Brushed Steel']
  },
  {
    id: 'warm_neutral',
    title: 'Warm Neutral',
    description: 'Earthy, inviting tones providing grounded tranquility.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85',
    palettes: ['#ECE1D2', '#CFC5B7', '#8B8376', '#201B12'],
    materials: ['Linen', 'Terracotta']
  },
  {
    id: 'industrial',
    title: 'Industrial',
    description: 'Raw materials, exposed elements, and urban edge.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85',
    palettes: ['#858383', '#5F5E5E', '#30312E', '#1C1C18'],
    materials: ['Exposed Brick', 'Raw Timber']
  },
  {
    id: 'luxury',
    title: 'Luxury',
    description: 'Premium materials, bespoke finishes, and refined details.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
    palettes: ['#FFFFFF', '#DCDAD5', '#1B1C19', '#000000'],
    materials: ['Marble', 'Brass']
  },
  {
    id: 'japandi',
    title: 'Japandi',
    description: 'Wabi-sabi simplicity meets Nordic warmth.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
    palettes: ['#F5F3EE', '#E4E2DD', '#CFC5B7', '#4D463B'],
    materials: ['Travertine', 'White Oak']
  }
];

const BUDGET_TIERS: BudgetTier[] = [
  { id: 'refresh', label: 'Light Refresh', description: 'Decor, styling, and minor updates.' },
  { id: 'full', label: 'Full Furnishing', description: 'Complete new furniture and layout.' },
  { id: 'overhaul', label: 'Architectural Overhaul', description: 'Renovation, flooring, and hard finishes.' }
];

export default function ChooseStylePage() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedStyle && selectedBudget) {
      // Create new search params, preserving any existing ones (like ?room=living_room)
      const params = new URLSearchParams(window.location.search);
      params.set('style', selectedStyle);
      params.set('budget', selectedBudget);
      router.push(`/project/new/review?${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-[#F4F2ED]">
      {/* Top Navbar */}
      <SiteHeader position="fixed" />

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-[120px] px-6 md:px-12 max-w-[1440px] mx-auto w-full flex flex-col">
        <WizardProgressBar 
          step={3} 
          title="Choose Your Style" 
          description="Select the aesthetic that feels most like home." 
        />
        
        <StyleGrid 
          options={STYLE_OPTIONS}
          selectedId={selectedStyle}
          onSelect={setSelectedStyle}
        />

        <BudgetScopeSelector 
          tiers={BUDGET_TIERS}
          selectedId={selectedBudget}
          onSelect={setSelectedBudget}
        />
      </main>

      <WizardFooter 
        onBack={() => router.push('/project/new/capture')}
        onContinue={handleContinue}
        canContinue={selectedStyle !== null && selectedBudget !== null}
      />
    </div>
  );
}
