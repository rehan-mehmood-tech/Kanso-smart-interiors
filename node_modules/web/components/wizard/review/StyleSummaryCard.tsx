import React from 'react';
import Link from 'next/link';

interface StyleSummaryCardProps {
  styleName: string;
}

export function StyleSummaryCard({ styleName }: StyleSummaryCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.04)] border border-outline-variant flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <h3 className="text-label-sm font-label-sm text-secondary mb-1 uppercase tracking-wider">Selected Style</h3>
        <p className="text-2xl font-medium text-primary capitalize">{styleName.replace(/_/g, ' ')}</p>
      </div>
      <Link href="/project/new/style" className="text-label-sm font-label-sm text-primary underline hover:text-secondary transition-colors text-left md:text-right w-fit">
        Edit
      </Link>
    </div>
  );
}
