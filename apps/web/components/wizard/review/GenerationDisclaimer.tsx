import React from 'react';
import { Info } from 'lucide-react';

export function GenerationDisclaimer() {
  return (
    <div className="bg-surface-container px-6 py-4 rounded-lg flex items-start gap-4 w-full">
      <Info className="text-secondary mt-1 w-5 h-5 shrink-0" />
      <div>
        <p className="text-body-md font-body-md text-on-surface-variant">
          Generating AI concepts takes about 1-2 minutes. Proceeding will lock these selections and consume 1 project credit.
        </p>
      </div>
    </div>
  );
}
