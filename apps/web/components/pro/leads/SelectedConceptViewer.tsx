import React from 'react';
import Image from 'next/image';
import { Palette, Check } from 'lucide-react';

interface SelectedConceptViewerProps {
  imageUrl: string;
  style: string;
  roomType: string;
}

export function SelectedConceptViewer({ imageUrl, style, roomType }: SelectedConceptViewerProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col h-full">
      <div className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-outline-variant/30 gap-4">
        <div>
          <h2 className="font-display-xl text-xl text-primary tracking-tight">Locked Design Concept</h2>
          <p className="font-label-sm text-[10px] text-secondary uppercase tracking-widest mt-1">Homeowner Selected Target</p>
        </div>
        <div className="flex items-center gap-1.5 text-primary bg-[#F4F2ED] px-3 py-1.5 rounded border border-outline-variant/50 shadow-sm shrink-0">
          <Palette className="w-4 h-4" />
          <span className="font-label-sm text-[10px] uppercase tracking-widest">{style}</span>
        </div>
      </div>
      
      <div className="relative flex-1 min-h-[300px] md:min-h-[400px]">
        <Image src={imageUrl} alt={roomType} fill sizes="(max-width: 1200px) 100vw, 50vw" className="object-cover absolute inset-0" />
      </div>

      <div className="p-4 bg-[#F4F2ED]/50 border-t border-outline-variant/50 flex flex-wrap gap-4 md:gap-6 text-sm font-body-md text-secondary">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-primary" /> Core Lighting Direction Locked
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-primary" /> Key Material Palette Locked
        </div>
      </div>
    </div>
  );
}
