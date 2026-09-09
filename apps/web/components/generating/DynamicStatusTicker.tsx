"use client";

import React, { useEffect, useState } from 'react';

/**
 * Status lines per pipeline stage.
 *
 * These used to cycle through all four regardless of what the server was
 * doing, so the page claimed to be "compiling moodboards" while it was still
 * waiting on the first analysis. Each stage now says what is actually
 * happening, and only cycles within that stage.
 */
const STAGE_STATUSES: Record<string, string[]> = {
  loading: ['Opening your project...'],
  analysing: [
    'Analyzing room geometry & wall lighting...',
    'Reading window placement and fixed elements...',
    'Estimating proportions from your four walls...',
  ],
  rendering: [
    'Applying chosen style palette...',
    'Matching pieces from verified local vendors...',
    'Generating high-fidelity spatial renders...',
    'Compiling material moodboards & spec suggestions...',
  ],
  done: ['Your concepts are ready.'],
  error: ['This render could not be completed.'],
};

interface DynamicStatusTickerProps {
  /** Current pipeline stage. Defaults to the render stage's lines. */
  stage?: string;
  /** Room name, used to make the first line specific to this project. */
  roomLabel?: string;
}

export function DynamicStatusTicker({ stage = 'rendering', roomLabel }: DynamicStatusTickerProps) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const statuses = STAGE_STATUSES[stage] ?? STAGE_STATUSES.rendering;

  // The cycle restarts on a stage change because the parent keys this
  // component by stage, so React remounts it with a fresh index. Resetting it
  // from an effect here would cascade a render instead.

  useEffect(() => {
    if (statuses.length <= 1) return;

    const interval = setInterval(() => {
      setFade(false); // fade out
      setTimeout(() => {
        setIndex(i => (i + 1) % statuses.length);
        setFade(true); // fade in
      }, 500); // half second to swap
    }, 2500); // 2.5s display time

    return () => clearInterval(interval);
  }, [statuses.length]);

  const line = statuses[index] ?? statuses[0];
  const prefixed = roomLabel && index === 0 && stage === 'analysing'
    ? `Analyzing your ${roomLabel.toLowerCase()}...`
    : line;

  return (
    <p className={`font-body-md text-base text-secondary h-6 mb-12 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      {prefixed}
    </p>
  );
}
