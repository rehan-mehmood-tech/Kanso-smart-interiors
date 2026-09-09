import React from 'react';
import { RotateCcw } from 'lucide-react';

interface ResultsHeaderProps {
  title: string;
  styleTag: string;
  /** Runs the pipeline again. Omitted where there is nothing to regenerate. */
  onRegenerate?: () => void;
}

export function ResultsHeader({ title, styleTag, onRegenerate }: ResultsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-surface-variant text-on-surface-variant text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-md border border-outline-variant/50">
            {styleTag}
          </span>
        </div>
        <h1 className="font-display-xl text-primary text-4xl md:text-5xl leading-tight tracking-tight">
          {title}
        </h1>
      </div>
      <button
        onClick={onRegenerate}
        disabled={!onRegenerate}
        className="disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-label-sm font-label-sm text-secondary hover:text-primary transition-colors duration-300 w-fit border border-outline-variant px-4 py-2 rounded-lg hover:bg-surface-variant">
        <RotateCcw className="w-4 h-4" />
        Regenerate
      </button>
    </div>
  );
}
