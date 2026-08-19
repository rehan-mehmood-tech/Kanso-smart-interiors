import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PhotosSummaryCardProps {
  photos: string[];
}

export function PhotosSummaryCard({ photos }: PhotosSummaryCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.04)] border border-outline-variant flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-label-sm font-label-sm text-secondary uppercase tracking-wider">Uploaded Photos</h3>
        <Link href="/project/new/capture" className="text-label-sm font-label-sm text-primary underline hover:text-secondary transition-colors">
          Edit
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {photos.map((src, idx) => (
          <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-outline-variant bg-surface-variant relative group cursor-pointer">
            <Image src={src} alt={`Uploaded wall ${idx + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
