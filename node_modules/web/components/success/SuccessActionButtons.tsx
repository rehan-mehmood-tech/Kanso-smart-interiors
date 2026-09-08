"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';

interface SuccessActionButtonsProps {
  projectId: string;
}

export function SuccessActionButtons({ projectId }: SuccessActionButtonsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center animate-[fade-in-up_0.6s_ease-out_0.5s_forwards] opacity-0 pt-4">
      <button 
        onClick={() => router.push('/dashboard')}
        className="inline-flex items-center justify-center px-8 py-4 bg-primary text-on-primary font-label-sm text-sm rounded-lg hover:bg-surface-tint transition-colors duration-300 w-full sm:w-auto sm:min-w-[240px] min-h-[44px] w-full sm:w-auto shadow-md hover:shadow-lg hover:-translate-y-0.5"
      >
        Return to My Spaces
      </button>
      <button 
        onClick={() => router.push(`/project/${projectId}/selected`)}
        className="inline-flex items-center justify-center px-8 py-4 border border-outline-variant text-primary font-label-sm text-sm rounded-lg hover:bg-surface-container transition-colors duration-300 w-full sm:w-auto sm:min-w-[240px] min-h-[44px] w-full sm:w-auto gap-2 shadow-sm hover:shadow-md"
      >
        <FileText className="w-4 h-4 text-primary" />
        Review Design Spec
      </button>
    </div>
  );
}
