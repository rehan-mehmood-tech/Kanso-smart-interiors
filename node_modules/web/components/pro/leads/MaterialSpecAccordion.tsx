"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SpecItem {
  category: string;
  items: string[];
}

export function MaterialSpecAccordion({ specs }: { specs: SpecItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="p-6 border-b border-outline-variant/30 bg-[#F4F2ED]/50">
        <h2 className="font-display-xl text-xl text-primary tracking-tight">Material & Execution Specs</h2>
      </div>
      
      <div className="divide-y divide-outline-variant/30">
        {specs.map((spec, idx) => (
          <div key={idx} className="group">
            <button 
              onClick={() => toggle(idx)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#F4F2ED]/50 transition-colors focus:outline-none"
            >
              <span className="font-label-sm text-[10px] uppercase tracking-widest text-primary font-bold">{spec.category}</span>
              <ChevronDown className={`w-4 h-4 text-secondary transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <ul className="px-6 pb-6 pt-2 space-y-3">
                {spec.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex gap-3 text-sm font-body-md text-secondary leading-relaxed">
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
