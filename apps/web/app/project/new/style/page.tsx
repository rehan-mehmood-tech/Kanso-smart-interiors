"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WizardProgressBar } from '@/components/wizard/WizardProgressBar';
import { StyleGrid } from '@/components/wizard/style/StyleGrid';
import { BudgetScopeSelector } from '@/components/wizard/style/BudgetScopeSelector';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { SiteHeader } from "@/components/layout/SiteHeader";
import { BUDGET_TIERS, STYLE_OPTIONS } from '@/lib/project/catalog';
import { setBudgetTier, setStyle, useWizard } from '@/lib/project/session';


export default function ChooseStylePage() {
  const router = useRouter();
  // Derived from the store with a local override, so returning to this step
  // shows what was already chosen. See the room-type step for why this is not
  // seeded into useState.
  const wizard = useWizard();
  const [pickedStyle, setPickedStyle] = useState<string | null>(null);
  const [pickedBudget, setPickedBudget] = useState<string | null>(null);

  const selectedStyle = pickedStyle ?? wizard.styleId;
  const selectedBudget = pickedBudget ?? wizard.budgetTierId;

  const handleContinue = () => {
    if (selectedStyle && selectedBudget) {
      setStyle(selectedStyle);
      setBudgetTier(selectedBudget);

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
          onSelect={setPickedStyle}
        />

        <BudgetScopeSelector 
          tiers={BUDGET_TIERS}
          selectedId={selectedBudget}
          onSelect={setPickedBudget}
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
