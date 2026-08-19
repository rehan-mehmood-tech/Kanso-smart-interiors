import React from 'react';

export function PulseIndicator() {
  return (
    <div className="relative flex justify-center items-center mb-12">
      <h1 className="font-display-xl font-normal text-6xl md:text-[72px] text-primary relative z-10 tracking-[-0.02em]">Kanso</h1>
      <div className="absolute inset-0 rounded-full bg-primary/5 scale-[2] animate-pulse"></div>
      <div className="absolute inset-0 rounded-full border border-primary/10 scale-[2.5] animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
    </div>
  );
}
