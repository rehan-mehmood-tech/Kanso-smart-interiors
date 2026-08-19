"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Expand } from 'lucide-react';

export interface WallPhotoItem {
  id: string;
  label: string;
  url: string;
}

export function WallCaptureGallery({ photos }: { photos: WallPhotoItem[] }) {
  const [expandedPhoto, setExpandedPhoto] = useState<WallPhotoItem | null>(null);

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      <h2 className="font-display-xl text-xl text-primary tracking-tight mb-6">Original Space (4-Wall Baseline)</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {photos.map(photo => (
          <div key={photo.id} className="relative group cursor-pointer" onClick={() => setExpandedPhoto(photo)}>
            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-outline-variant/30 relative bg-[#F4F2ED]">
              <Image src={photo.url} alt={photo.label} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors flex items-center justify-center">
                <Expand className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary">{photo.label}</span>
            </div>
          </div>
        ))}
      </div>

      {expandedPhoto && (
        <div className="fixed inset-0 z-[100] bg-background/95 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm">
          <div className="relative max-w-5xl w-full max-h-full flex flex-col items-center">
            <button 
              onClick={() => setExpandedPhoto(null)}
              className="absolute -top-12 right-0 md:-right-12 text-secondary hover:text-primary bg-surface-container-lowest rounded-full p-2 border border-outline-variant/50 transition-colors shadow-sm"
            >
              <X className="w-6 h-6" />
            </button>
            <Image 
              src={expandedPhoto.url} 
              alt={expandedPhoto.label} 
              width={1200}
              height={800}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl border border-outline-variant/30 bg-[#F4F2ED]" 
            />
            <div className="mt-6 bg-surface-container-lowest/90 backdrop-blur px-6 py-2 rounded border border-outline-variant/30 shadow-lg">
              <span className="font-label-sm text-xs uppercase tracking-widest text-primary">{expandedPhoto.label}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
