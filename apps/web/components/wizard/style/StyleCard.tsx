import React from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';

export interface StyleOption {
  id: string;
  title: string;
  description: string;
  image: string;
  palettes?: string[];
  materials?: string[];
}

interface StyleCardProps {
  option: StyleOption;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function StyleCard({ option, selected, onSelect }: StyleCardProps) {
  return (
    <label className="cursor-pointer relative group block w-full h-full">
      <input 
        className="sr-only" 
        name="style_selection" 
        type="radio" 
        value={option.id}
        checked={selected}
        onChange={() => onSelect(option.id)}
      />
      <div className={`border rounded-[16px] overflow-hidden bg-surface-container-lowest transition-all duration-300 h-full flex flex-col group-hover:border-outline ${selected ? 'border-primary' : 'border-outline-variant'}`}>
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Image 
            src={option.image} 
            alt={`${option.title} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          <div className={`absolute inset-0 transition-colors duration-300 ${selected ? 'bg-primary/20' : 'bg-transparent'}`}></div>
          
          <div className={`absolute top-4 right-4 bg-primary text-on-primary rounded-full p-1 transition-opacity duration-300 flex items-center justify-center ${selected ? 'opacity-100' : 'opacity-0'}`}>
            <Check className="w-4 h-4" />
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-2xl font-medium text-primary mb-1 tracking-tight">{option.title}</h3>
          <p className="text-base text-secondary mb-4">{option.description}</p>
          
          {/* Swatches & Materials */}
          <div className="mt-auto space-y-3 pt-2 border-t border-outline-variant/30">
            {option.palettes && (
              <div className="flex gap-2">
                {option.palettes.map((color, i) => (
                  <div key={i} className="w-4 h-4 rounded-full border border-outline-variant shadow-sm" style={{ backgroundColor: color }} />
                ))}
              </div>
            )}
            {option.materials && (
              <div className="flex flex-wrap gap-2">
                {option.materials.map((mat, i) => (
                  <span key={i} className="text-xs bg-surface-variant text-on-surface-variant px-2 py-1 rounded-md uppercase tracking-wider font-semibold">
                    {mat}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </label>
  );
}
