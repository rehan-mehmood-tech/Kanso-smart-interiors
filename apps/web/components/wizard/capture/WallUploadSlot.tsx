import React, { useRef } from 'react';
import Image from 'next/image';
import { Box, CheckCircle2, RotateCcw, X } from 'lucide-react';

export interface WallCaptureState {
  id: string;
  label: string;
  file: File | null;
  previewUrl: string | null;
  rotation: number; // For the box icon
}

interface WallUploadSlotProps {
  state: WallCaptureState;
  onUpload: (id: string, file: File) => void;
  onRemove: (id: string) => void;
}

export function WallUploadSlot({ state, onUpload, onRemove }: WallUploadSlotProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!state.previewUrl) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(state.id, file);
    }
    // reset input so the same file can be uploaded again if removed
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div 
      className={`group relative rounded-xl aspect-[4/3] flex flex-col items-center justify-center p-6 overflow-hidden transition-all duration-300 ${
        state.previewUrl 
          ? 'bg-surface border border-secondary/50 shadow-sm' 
          : 'bg-surface-container-lowest border border-outline-variant hover:border-outline cursor-pointer focus-within:ring-2 focus-within:ring-outline'
      }`}
      onClick={handleClick}
    >
      {/* Hidden File Input */}
      <input 
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {state.previewUrl ? (
        <>
          <Image src={state.previewUrl} alt={`${state.label} preview`} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
          <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="bg-surface/90 text-on-surface p-2 rounded-full hover:bg-surface transition-colors"
              title="Replace image"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onRemove(state.id); }}
              className="bg-error/90 text-on-error p-2 rounded-full hover:bg-error transition-colors"
              title="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Subtle Success Indicator when not hovering */}
          <div className="absolute top-3 right-3 bg-surface/80 rounded-full p-1 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
             <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-surface-variant opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-0"></div>
          <div className="relative z-10 flex flex-col items-center transition-transform duration-300 group-hover:-translate-y-1">
            <div style={{ transform: `rotate(${state.rotation}deg)` }} className="mb-4">
              <Box className="text-outline w-10 h-10 stroke-[1.5]" />
            </div>
            <span className="text-label-sm font-label-sm text-secondary uppercase mb-1">{state.label}</span>
            <span className="text-body-md font-body-md text-primary font-medium flex items-center gap-2">
              Upload Photo
            </span>
          </div>
        </>
      )}
    </div>
  );
}
