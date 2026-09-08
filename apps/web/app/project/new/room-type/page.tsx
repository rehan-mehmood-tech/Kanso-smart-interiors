"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WizardProgressBar } from '@/components/wizard/WizardProgressBar';
import { RoomTypeGrid } from '@/components/wizard/RoomTypeGrid';
import { WizardFooter } from '@/components/wizard/WizardFooter';
import { SiteHeader } from "@/components/layout/SiteHeader";

const ROOM_OPTIONS = [
  {
    id: 'living_room',
    title: 'Living Room',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85'
  },
  {
    id: 'bedroom',
    title: 'Bedroom',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85'
  },
  {
    id: 'dining_room',
    title: 'Dining Room',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85'
  },
  {
    id: 'home_office',
    title: 'Home Office',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85'
  },
  {
    id: 'kids_room',
    title: 'Kids Room',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85'
  },
  {
    id: 'other',
    title: 'Other',
    isCustom: true
  }
];

export default function SelectRoomTypePage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState<string>('');

  const handleSelect = (id: string, customVal?: string) => {
    setSelectedId(id);
    if (customVal !== undefined) {
      setCustomValue(customVal);
    }
  };

  const handleContinue = () => {
    if (!selectedId) return;
    
    // Store in query param so next step can read it
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
