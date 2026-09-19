"use client";

import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Heart, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { likeDesign, saveDesign, selectDesign } from '@/lib/api/projects';

interface ActionFloatingBarProps {
  projectId: string;
  /** The concept currently on screen. Carried forward as the selection. */
  designId?: string;
  /** Server-resolved state for that concept, so the icons start correct. */
  liked?: boolean;
  saved?: boolean;
  /** Lets the page update its copy of the concept after a toggle. */
  onInteractionChange?: (designId: string, next: { liked?: boolean; saved?: boolean }) => void;
}

export function ActionFloatingBar({
  projectId,
  designId,
  liked = false,
  saved = false,
  onInteractionChange,
}: ActionFloatingBarProps) {
  const router = useRouter();
  const [isSelecting, setIsSelecting] = useState(false);
  const [pending, setPending] = useState<'like' | 'save' | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Toggle optimistically, then reconcile with what the server says.
   *
   * The icon flips immediately because waiting on a round trip makes a
   * like feel broken; if the call fails the parent is told the true state and
   * the icon flips back, so the UI never claims a save that did not happen.
   */
  const runToggle = async (kind: 'like' | 'save') => {
    if (!designId || pending) return;
    setError(null);
    setPending(kind);

    const optimistic = kind === 'like' ? !liked : !saved;
    onInteractionChange?.(designId, { [kind === 'like' ? 'liked' : 'saved']: optimistic });

    try {
      const confirmed = kind === 'like' ? await likeDesign(designId) : await saveDesign(designId);
      onInteractionChange?.(designId, { [kind === 'like' ? 'liked' : 'saved']: confirmed });
    } catch {
      onInteractionChange?.(designId, { [kind === 'like' ? 'liked' : 'saved']: !optimistic });
      setError("That didn't save. Please try again.");
    } finally {
      setPending(null);
    }
  };

  const handleSelect = async () => {
    if (!designId || isSelecting) return;
    setError(null);
    setIsSelecting(true);

    try {
      // Persist the choice before navigating: the confirmation page reads the
      // selection from the project, so moving first would show a stale one.
      await selectDesign(projectId, designId);
      router.push(`/project/${projectId}/selected?design=${encodeURIComponent(designId)}`);
    } catch {
      setError("We couldn't select that concept. Please try again.");
      setIsSelecting(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant p-4 md:px-6 z-40 flex flex-col items-center shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
      {error && (
        <p role="alert" className="mb-2 font-body-md text-body-md text-error">
          {error}
        </p>
      )}

      <div className="max-w-container-max-app w-full flex justify-between items-center px-2 gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => void runToggle('like')}
            disabled={!designId || pending === 'like'}
            aria-pressed={liked}
            aria-label={liked ? 'Remove like' : 'Like this concept'}
            className={`flex items-center gap-2 font-label-sm text-label-sm px-4 py-3 rounded-lg transition-colors border border-outline-variant/50 disabled:opacity-50 ${
              liked
                ? 'text-primary bg-surface-variant'
                : 'text-secondary bg-surface-container-lowest hover:bg-surface-variant hover:text-primary'
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{liked ? 'Liked' : 'Like'}</span>
          </button>

          <button
            onClick={() => void runToggle('save')}
            disabled={!designId || pending === 'save'}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from moodboard' : 'Save to moodboard'}
            className={`flex items-center gap-2 font-label-sm text-label-sm px-4 py-3 rounded-lg transition-colors border border-outline-variant/50 disabled:opacity-50 ${
              saved
                ? 'text-primary bg-surface-variant'
                : 'text-secondary bg-surface-container-lowest hover:bg-surface-variant hover:text-primary'
            }`}
          >
            {saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            <span className="hidden sm:inline">
              {saved ? 'Saved to Moodboard' : 'Save to Moodboard'}
            </span>
            <span className="sm:hidden">{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        <button
          onClick={() => void handleSelect()}
          disabled={!designId || isSelecting}
          className={`bg-primary text-on-primary font-label-sm text-label-sm px-6 md:px-8 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
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
