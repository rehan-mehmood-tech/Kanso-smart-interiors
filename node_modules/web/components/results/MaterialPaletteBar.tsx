import React from 'react';

export interface MaterialItem {
  name: string;
  color: string;
}

interface MaterialPaletteBarProps {
  materials: MaterialItem[];
}

export function MaterialPaletteBar({ materials }: MaterialPaletteBarProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant mb-12">
      <h3 className="text-label-sm font-label-sm text-secondary mb-4 uppercase tracking-widest">Extracted Materials</h3>
      <div className="flex flex-wrap gap-4">
        {materials.map((mat, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-surface-variant/50 pr-4 rounded-full border border-outline-variant/50 transition-colors hover:bg-surface-variant group cursor-default">
            <div 
              className="w-8 h-8 rounded-full border border-outline-variant shadow-sm"
              style={{ backgroundColor: mat.color }}
            />
            <span className="text-label-sm font-label-sm text-primary tracking-wide">
              {mat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
