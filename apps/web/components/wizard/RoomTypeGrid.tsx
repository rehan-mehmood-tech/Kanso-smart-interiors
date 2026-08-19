"use client";

import React, { useState } from 'react';
import { RoomTypeOption, RoomTypeCard } from './RoomTypeCard';

interface RoomTypeGridProps {
  options: RoomTypeOption[];
  selectedId: string | null;
  onSelect: (id: string, customValue?: string) => void;
}

export function RoomTypeGrid({ options, selectedId, onSelect }: RoomTypeGridProps) {
  const [customVal, setCustomVal] = useState('');

  const handleSelect = (id: string) => {
    onSelect(id, id === 'other' ? customVal : undefined);
  };

  const handleCustomChange = (val: string) => {
    setCustomVal(val);
    onSelect('other', val);
  };

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {options.map((opt) => (
        <RoomTypeCard 
          key={opt.id}
          option={opt}
          selected={selectedId === opt.id}
          onSelect={handleSelect}
          customValue={customVal}
          onCustomValueChange={handleCustomChange}
        />
      ))}
    </div>
  );
}
