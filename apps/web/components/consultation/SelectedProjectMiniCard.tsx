import React from 'react';
import Image from 'next/image';

interface SelectedProjectMiniCardProps {
  imageUrl: string;
  roomType: string;
  style: string;
}

export function SelectedProjectMiniCard({ imageUrl, roomType, style }: SelectedProjectMiniCardProps) {
  return (
    <div className="w-full flex items-center gap-4 bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-5 shadow-sm">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-outline-variant/30">
        <Image src={imageUrl} alt={roomType} fill sizes="64px" className="object-cover" />
      </div>
      <div className="min-w-0">
        <h3 className="text-body-md font-body-md text-primary font-semibold mb-1 truncate">{roomType} Project</h3>
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-on-surface-variant bg-surface-variant px-2 py-0.5 rounded-md">
          {style}
        </span>
      </div>
    </div>
  );
}
