"use client";

import React from 'react';
import { StyleOption, StyleCard } from './StyleCard';

interface StyleGridProps {
  options: StyleOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function StyleGrid({ options, selectedId, onSelect }: StyleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full mb-12">
      {options.map((opt) => (
        <StyleCard 
          key={opt.id}
          option={opt}
          selected={selectedId === opt.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
