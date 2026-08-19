import React from 'react';

interface WizardProgressBarProps {
  step: number;
  totalSteps?: number;
  title: string;
  description: string;
}

export function WizardProgressBar({ step, totalSteps = 4, title, description }: WizardProgressBarProps) {
  return (
    <div className="w-full max-w-4xl mb-12 text-center md:text-left mt-6">
      <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-2">
        Step {step} of {totalSteps}
      </p>
      <h1 className="font-display-xl text-4xl md:text-[72px] leading-tight md:leading-[84px] tracking-[-0.02em] text-primary mb-4">
        {title}
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
        {description}
      </p>
    </div>
  );
}
