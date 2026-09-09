import React from 'react';

export function ConsultationHeader() {
  return (
    <div className="space-y-4 md:space-y-6 text-center">
      <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">Book a Specialist</p>
      <h1 className="font-display-xl text-4xl md:text-5xl leading-tight text-primary text-balance">Begin Your Physical Transformation</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mx-auto max-w-[34rem] pt-2">
        Review material samples, finalize dimensions, and lock vendor pricing with a certified Kanso specialist.
      </p>
    </div>
  );
}
