"use client";

import React from 'react';

export interface BudgetTier {
  id: string;
  label: string;
  description: string;
}

interface BudgetScopeSelectorProps {
  tiers: BudgetTier[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function BudgetScopeSelector({ tiers, selectedId, onSelect }: BudgetScopeSelectorProps) {
  return (
    <div className="w-full mb-12 border-t border-outline-variant/30 pt-10">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-primary mb-2">Project Scope & Budget</h2>
        <p className="text-base text-secondary">Help us align the aesthetic with your practical goals.</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        {tiers.map(tier => (
          <button
            key={tier.id}
            onClick={() => onSelect(tier.id)}
            className={`flex-1 text-left p-4 rounded-xl border transition-all duration-300 ${
              selectedId === tier.id 
                ? 'border-primary bg-surface-container-high transform -translate-y-1' 
                : 'border-outline-variant bg-surface-container-lowest hover:border-outline hover:-translate-y-1'
            }`}
          >
            <div className="font-medium text-primary mb-1">{tier.label}</div>
            <div className="text-sm text-secondary">{tier.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
