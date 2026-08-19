import React from 'react';
import { Download } from 'lucide-react';

export function DownloadProposalButton() {
  return (
    <button className="flex items-center gap-2 border border-outline text-primary font-label-sm text-label-sm rounded-[4px] px-6 py-3 hover:bg-surface-variant transition-colors duration-300 w-full md:w-auto justify-center">
      <Download className="w-4 h-4" />
      Download PDF Proposal
    </button>
  );
}
