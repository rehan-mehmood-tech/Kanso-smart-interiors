import React from 'react';
import Image from 'next/image';
import { CheckCircle2, Plus } from 'lucide-react';

export interface RoomTypeOption {
  id: string;
  title: string;
  image?: string;
  isCustom?: boolean;
}

interface RoomTypeCardProps {
  option: RoomTypeOption;
  selected: boolean;
  onSelect: (id: string) => void;
  customValue?: string;
  onCustomValueChange?: (val: string) => void;
}

export function RoomTypeCard({ option, selected, onSelect, customValue, onCustomValueChange }: RoomTypeCardProps) {
  return (
    <div 
      onClick={() => onSelect(option.id)}
      className={`cursor-pointer rounded-[16px] border overflow-hidden flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        selected 
          ? 'border-primary bg-surface-container-high transform -translate-y-1' 
          : 'border-outline-variant bg-surface-container-lowest hover:-translate-y-1'
      }`}
    >
      {option.isCustom ? (
        <div className="h-48 w-full flex items-center justify-center bg-surface-container-low border-b border-outline-variant">
          <Plus className="w-16 h-16 text-outline-variant stroke-[1]" />
        </div>
      ) : (
        <div className="h-48 w-full overflow-hidden relative bg-surface-variant">
          {option.image && (
            <Image 
              src={option.image} 
              alt={`${option.title} preview`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`object-cover w-full h-full absolute inset-0 transition-transform duration-700 hover:scale-105 ${selected ? 'opacity-90' : ''}`}
            />
          )}
        </div>
      )}
      
      <div className="p-6 flex flex-col justify-center h-full min-h-[72px]">
        {option.isCustom && selected ? (
          <div className="w-full mt-2" onClick={(e) => e.stopPropagation()}>
            <input 
              type="text"
              autoFocus
              value={customValue || ''}
              onChange={(e) => onCustomValueChange?.(e.target.value)}
              placeholder="Specify room type..."
              className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-2 outline-none shadow-none font-body-md text-body-md text-primary placeholder:text-outline-variant focus:border-outline focus:ring-0 transition-colors duration-300"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="font-headline-md text-2xl font-medium text-primary">{option.title}</span>
            {selected && <CheckCircle2 className="w-6 h-6 text-primary fill-primary text-on-primary" />}
          </div>
        )}
      </div>
    </div>
  );
}
