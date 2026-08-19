import React from 'react';
import { Lightbulb } from 'lucide-react';

export function CaptureGuidelines() {
  return (
    <div className="bg-surface-container px-6 py-4 rounded-lg flex items-start gap-4 max-w-2xl w-full mb-12">
      <Lightbulb className="text-secondary mt-1 w-6 h-6 shrink-0" />
      <div>
        <span className="text-label-sm font-label-sm text-secondary uppercase block mb-1">Tips for best results</span>
        <p className="text-body-md font-body-md text-on-surface-variant">Face the wall directly and keep your phone around eye level. Ensure the room is well lit.</p>
      </div>
    </div>
  );
}
