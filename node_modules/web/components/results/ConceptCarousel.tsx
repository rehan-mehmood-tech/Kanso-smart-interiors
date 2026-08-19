"use client";

import React from 'react';
import Image from 'next/image';
import { Maximize2 } from 'lucide-react';

export interface DesignConcept {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

interface ConceptCarouselProps {
  concepts: DesignConcept[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

export function ConceptCarousel({ concepts, activeIndex, onIndexChange }: ConceptCarouselProps) {
  const activeConcept = concepts[activeIndex];

  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* Main Stage */}
      <div className="w-full aspect-[4/3] md:aspect-[16/9] rounded-[16px] overflow-hidden relative border border-outline-variant shadow-[0_4px_24px_rgba(0,0,0,0.04)] group bg-surface-container-lowest">
        <Image 
          src={activeConcept.image} 
          alt={activeConcept.title}
          fill
          sizes="(max-width: 1200px) 100vw, 75vw"
          priority={true}
          className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.02]"
        />
        <button className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md text-on-surface p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-surface">
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Concept Meta & Thumbnails */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-8 flex flex-col gap-3">
          <h2 className="text-2xl md:text-3xl font-display-xl text-primary">{activeConcept.title}</h2>
          <p className="text-body-lg font-body-lg text-secondary leading-relaxed mb-2">
            {activeConcept.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {activeConcept.features.map((feature, idx) => (
              <span key={idx} className="text-xs bg-surface-container-high text-on-surface-variant px-3 py-1.5 rounded-md uppercase tracking-wider font-semibold border border-outline-variant/30">
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="md:col-span-4 flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {concepts.map((concept, idx) => (
            <button 
              key={concept.id}
              onClick={() => onIndexChange(idx)}
              className={`relative aspect-[16/9] w-32 md:w-full flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                activeIndex === idx 
                  ? 'border-primary shadow-sm scale-100' 
                  : 'border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]'
              }`}
            >
              <Image src={concept.image} alt={concept.title} fill sizes="128px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
