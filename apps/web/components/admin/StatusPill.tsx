import React from 'react';

type Tone = 'positive' | 'neutral' | 'warning' | 'critical';

const TONES: Record<Tone, string> = {
  positive: 'border-[#3c6b4a]/30 bg-[#3c6b4a]/10 text-[#3c6b4a]',
  neutral: 'border-[#c4c7c7] bg-[#f4f0ea] text-[#1b1c19]/65',
  warning: 'border-[#92651a]/30 bg-[#92651a]/12 text-[#92651a]',
  critical: 'border-[#9d3f30]/30 bg-[#9d3f30]/10 text-[#9d3f30]',
};

/**
 * State is carried by the label as well as the colour, so it survives a
 * colour-vision difference or a greyscale print.
 */
export function StatusPill({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded border px-2 py-0.5 font-label-sm text-[10px] tracking-wider uppercase ${TONES[tone]}`}
    >
      {label}
    </span>
  );
}
