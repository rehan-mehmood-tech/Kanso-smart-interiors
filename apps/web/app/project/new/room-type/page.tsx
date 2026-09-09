"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WizardProgressBar } from '@/components/wizard/WizardProgressBar';
import { RoomTypeGrid } from '@/components/wizard/RoomTypeGrid';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ROOM_OPTIONS } from '@/lib/project/catalog';
import { setRoom, useWizard } from '@/lib/project/session';


export default function SelectRoomTypePage() {
  const router = useRouter();
  // Selection is DERIVED from the store with a local override, not copied into
  // state by an effect. A plain useState seed would miss the store's
  // sessionStorage rehydration, which lands after the first render, so a
  // reloaded step would forget the customer's choice.
  const wizard = useWizard();
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState<string | null>(null);

  const selectedId = picked ?? wizard.roomId;
  const customValue = typed ?? wizard.customRoom ?? '';

  const handleSelect = (id: string, customVal?: string) => {
    setPicked(id);
    if (customVal !== undefined) {
      setTyped(customVal);
    }
  };

  const handleContinue = () => {
    if (!selectedId) return;

    // The store is what later steps read. The query string is kept so the URL
    // stays shareable and a refreshed step can still recover the choice.
    setRoom(selectedId, selectedId === 'other' ? customValue : undefined);

    const params = new URLSearchParams();
    params.set('room', selectedId);
    if (selectedId === 'other' && customValue) {
      params.set('custom', customValue);
    }

    router.push(`/project/new/capture?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-[#F4F2ED]">
      {/* Top Navbar */}
      <SiteHeader position="fixed" />

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-[120px] px-6 md:px-12 max-w-[1280px] mx-auto w-full flex flex-col items-center">
        <WizardProgressBar 
          step={1} 
          title="Which room are we designing?" 
          description="Select the primary space you want to focus on to help us tailor our architectural editorial approach to your project." 
        />
        <RoomTypeGrid 
          options={ROOM_OPTIONS}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      </main>

      <WizardFooter 
        onBack={() => router.push('/dashboard')}
        onContinue={handleContinue}
        canContinue={selectedId !== null && (selectedId !== 'other' || customValue.trim().length > 0)}
      />
    </div>
  );
}
