"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface SpecItem {
  category: string;
  items: string[];
}

interface DesignSpecSheetProps {
  specs: SpecItem[];
  description: string;
}

export function DesignSpecSheet({ specs, description }: DesignSpecSheetProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant mb-12">
      <div 
        className="flex justify-between items-center cursor-pointer mb-6"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-2xl font-headline-md text-primary">Design Specification</h2>
        <button className="text-secondary hover:text-primary transition-colors">
          {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="animate-in slide-in-from-top-4 fade-in duration-300">
          <p className="text-body-md font-body-md text-secondary mb-8 leading-relaxed">
            {description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specs.map((spec, idx) => (
              <div key={idx}>
                <h4 className="text-label-sm font-label-sm text-secondary uppercase tracking-widest mb-3">
                  {spec.category}
                </h4>
                <ul className="space-y-2">
                  {spec.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-body-md font-body-md text-primary flex items-start gap-2">
                      <span className="text-primary mt-2 w-1.5 h-1.5 rounded-full bg-outline shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
