"use client";

import React, { useState, useEffect } from 'react';

const STATUSES = [
  "Scanning verified interior specialists in your area...",
  "Matching project aesthetic with artisan portfolios...",
  "Checking consultant availability & scheduling window...",
  "Specialist matched! Finalizing booking details..."
];

export function MatchingStatusTicker() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // fade out
      setTimeout(() => {
        setIndex(i => Math.min(i + 1, STATUSES.length - 1)); // stop at last status
        setFade(true); // fade in
      }, 300); // short swap
    }, 1500); // 1.5s display time

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center mb-12 max-w-[36rem] h-24 flex flex-col justify-center items-center">
      <h1 className="font-display-xl text-4xl md:text-5xl text-primary mb-4 tracking-tight">
        Finding your local specialist...
      </h1>
      <p className={`font-body-lg text-lg text-secondary transition-opacity duration-300 h-8 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        {STATUSES[index]}
      </p>
    </div>
  );
}
