import React from 'react';
import { Check } from 'lucide-react';

export interface ServiceTier {
  name: string;
  leadTime: string;
  features: string[];
}

export function ServiceTierSpecs({ tiers }: { tiers: ServiceTier[] }) {
  return (
    <div className="mb-12">
      <h2 className="font-display-xl text-2xl text-primary tracking-tight mb-6">Service & Execution Tiers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiers.map((tier, idx) => (
          <div key={idx} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col">
            <h3 className="font-display-xl text-lg text-primary tracking-tight mb-1">{tier.name}</h3>
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary mb-6 block">
              Lead Time: {tier.leadTime}
            </span>
            
            <ul className="space-y-3 flex-1 mb-6">
              {tier.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex gap-3 text-sm font-body-md text-secondary leading-relaxed">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <button className="w-full border border-outline-variant/50 text-primary py-2.5 rounded font-label-sm text-[10px] uppercase tracking-widest hover:bg-[#F4F2ED] transition-colors shadow-sm">
              Inquire Rate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
