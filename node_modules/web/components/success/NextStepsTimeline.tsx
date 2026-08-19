import React from 'react';

const TIMELINE_STEPS = [
  "Specialist Reviews 4-Wall Capture & Spec Sheet",
  "Direct Contact via WhatsApp/Call to confirm time",
  "On-site / Virtual Consultation & Material Sampling"
];

export function NextStepsTimeline() {
  return (
    <div className="mb-12 animate-[fade-in-up_0.6s_ease-out_0.4s_forwards] opacity-0 w-full px-2">
      <h3 className="font-label-sm text-xs text-secondary uppercase tracking-widest mb-8 text-center md:text-left">
        Next Steps
      </h3>
      <div className="flex flex-col md:flex-row justify-between relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-4 left-[10%] right-[10%] h-[1px] bg-outline-variant/50 z-0"></div>
        
        {/* Connecting Line (Mobile) */}
        <div className="md:hidden absolute top-4 bottom-12 left-4 w-[1px] bg-outline-variant/50 z-0"></div>

        {TIMELINE_STEPS.map((step, idx) => (
          <div key={idx} className="relative z-10 flex flex-row md:flex-col items-center md:items-center text-left md:text-center w-full md:w-1/3 mb-8 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-label-sm text-sm flex items-center justify-center border-4 border-[#FBF9F4] shrink-0 mr-4 md:mr-0 md:mb-4 shadow-sm">
              {idx + 1}
            </div>
            <p className="font-body-md text-sm text-primary max-w-[200px] md:mx-auto">
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
