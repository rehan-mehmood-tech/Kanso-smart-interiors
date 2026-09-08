"use client";

import React from 'react';

interface GenerationProgressBarProps {
  progress: number; // 0 to 100
}

export function GenerationProgressBar({ progress }: GenerationProgressBarProps) {
  return (
    <div className="w-full max-w-[28rem] h-[1px] bg-outline-variant rounded-full overflow-hidden">
      <div 
        className="h-full bg-primary rounded-full transition-all duration-[100ms] ease-linear" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
}
