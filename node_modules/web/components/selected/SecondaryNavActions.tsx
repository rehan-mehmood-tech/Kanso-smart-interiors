import React from 'react';
import Link from 'next/link';

interface SecondaryNavActionsProps {
  projectId: string;
}

export function SecondaryNavActions({ projectId }: SecondaryNavActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 py-6 border-t border-outline-variant/30">
      <Link 
        href={`/project/${projectId}/results`}
        className="text-label-sm font-label-sm text-secondary hover:text-primary underline-offset-4 hover:underline transition-all duration-300"
      >
        Back to Concept Gallery
      </Link>
      <div className="hidden sm:block w-1 h-1 rounded-full bg-outline-variant"></div>
      <Link 
        href="/dashboard"
        className="text-label-sm font-label-sm text-secondary hover:text-primary underline-offset-4 hover:underline transition-all duration-300"
      >
        My Dashboard
      </Link>
    </div>
  );
}
