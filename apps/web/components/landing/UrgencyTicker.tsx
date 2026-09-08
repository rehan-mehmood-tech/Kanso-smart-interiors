import React from "react";
import { Sparkles, UserCheck, Timer } from "lucide-react";

const ITEMS = [
  { icon: Sparkles, text: "Flash Offer: Free Spatial Render Credits Ending Soon" },
  { icon: UserCheck, text: "Limited Verified Artisan Slots Available" },
  { icon: Timer, text: "Lock Your Design Scope Today" },
];

export function UrgencyTicker() {
  // Lane is rendered twice back-to-back so the -50% translate loops seamlessly.
  const lane = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="flex h-11 w-full items-center overflow-hidden border-y border-[#c4c7c7] bg-[#1b1c19]">
      <div className="flex w-max animate-marquee items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
            {lane.map((item, i) => {
              const Icon = item.icon;
              return (
                <span
                  key={`${copy}-${i}`}
                  className="flex items-center gap-2.5 px-8 font-body text-xs tracking-[0.14em] whitespace-nowrap text-[#fbf9f4]/85 uppercase"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-[#fbf9f4]/55" />
                  {item.text}
                  <span className="ml-8 text-[#fbf9f4]/25">/</span>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
