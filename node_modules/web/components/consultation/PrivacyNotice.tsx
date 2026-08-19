import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function PrivacyNotice() {
  return (
    <div className="flex items-start gap-3 mt-6 p-4 bg-surface-container-low rounded-lg border border-outline-variant/30">
      <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
      <p className="text-xs font-body-md text-secondary leading-relaxed">
        Your information is securely encrypted. We only match you with verified, Kanso-certified specialists. Zero spam, guaranteed.
      </p>
    </div>
  );
}
