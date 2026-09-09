"use client";

import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ActionFloatingBarProps {
  projectId: string;
  /** The concept currently on screen. Carried forward as the selection. */
  designId?: string;
}

export function ActionFloatingBar({ projectId, designId }: ActionFloatingBarProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSelect = () => {
    setIsSelecting(true);
    // Which concept was chosen travels in the URL, so the pages after this one
    // show that concept rather than guessing. Without it they fell back to a
    // stock asset keyed off the project id.
    const query = designId ? `?design=${encodeURIComponent(designId)}` : '';
    router.push(`/project/${projectId}/selected${query}`);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant p-4 md:px-6 z-40 flex justify-center shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
      <div className="max-w-container-max-app w-full flex justify-between items-center px-2">
        <button 
          onClick={() => setSaved(!saved)}
          className={`flex items-center gap-2 font-label-sm text-label-sm px-4 py-3 rounded-lg transition-colors border border-outline-variant/50 ${
            saved ? 'text-primary bg-surface-variant' : 'text-secondary bg-surface-container-lowest hover:bg-surface-variant hover:text-primary'
          }`}
        >
          {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          <span className="hidden sm:inline">{saved ? 'Saved to Moodboard' : 'Save to Moodboard'}</span>
          <span className="sm:hidden">{saved ? 'Saved' : 'Save'}</span>
        </button>
        
        <button 
          onClick={handleSelect}
          disabled={isSelecting}
          className={`bg-primary text-on-primary font-label-sm text-label-sm px-6 md:px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 ${
            !isSelecting ? 'opacity-100 hover:bg-surface-tint' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isSelecting ? (
            <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Select This Concept
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
