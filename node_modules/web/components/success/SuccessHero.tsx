import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export function SuccessHero() {
  return (
    <div className="flex flex-col items-center text-center mb-12 w-full">
      <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center mb-8 animate-[fade-in-up_0.6s_ease-out_forwards]">
        <CheckCircle2 className="w-12 h-12 text-primary" strokeWidth={1.5} />
      </div>
      <h1 className="font-display-xl text-4xl md:text-5xl lg:text-[64px] text-primary mb-6 animate-[fade-in-up_0.6s_ease-out_0.1s_forwards] opacity-0 tracking-tight leading-tight">
        Your Consultation is Requested
      </h1>
      <p className="font-body-lg text-lg text-on-surface-variant max-w-xl animate-[fade-in-up_0.6s_ease-out_0.2s_forwards] opacity-0">
        Elena Rossi has been tentatively assigned to your project. Expect a call within 24 hours to confirm your schedule and next steps.
      </p>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
