"use client";

import React, { useState, useEffect } from 'react';

const STATUSES = [
  "Analyzing room geometry & wall lighting...",
  "Applying chosen style palette...",
  "Generating high-fidelity 3D spatial renders...",
  "Compiling material moodboards & spec suggestions..."
];

export function DynamicStatusTicker() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // fade out
      setTimeout(() => {
        setIndex(i => (i + 1) % STATUSES.length);
        setFade(true); // fade in
      }, 500); // half second to swap
    }, 2500); // 2.5s display time

    return () => clearInterval(interval);
  }, []);

  return (
    <p className={`font-body-md text-base text-secondary h-6 mb-12 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
      {STATUSES[index]}
    </p>
  );
}
