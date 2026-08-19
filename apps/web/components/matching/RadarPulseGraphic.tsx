import React from 'react';
import { Search } from 'lucide-react';

export function RadarPulseGraphic() {
  return (
    <div className="relative flex items-center justify-center mb-12 w-48 h-48">
      <div className="absolute inset-0 border border-primary/20 rounded-full animate-[pulse-ring_2.5s_cubic-bezier(0.215,0.61,0.355,1)_infinite]"></div>
      <div className="absolute inset-4 border border-primary/40 rounded-full animate-[pulse-ring_2.5s_cubic-bezier(0.215,0.61,0.355,1)_infinite] delay-[800ms]"></div>
      <div className="w-16 h-16 bg-primary rounded-full animate-[pulse-dot_2.5s_cubic-bezier(0.455,0.03,0.515,0.955)_infinite] flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] z-10">
        <Search className="text-on-primary w-8 h-8" strokeWidth={2.5} />
      </div>
      
      {/* Adding styles directly since Tailwind JIT arbitrary values for keyframes can sometimes be verbose */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.5; }
            80%, 100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes pulse-dot {
            0% { transform: scale(0.8); }
            50% { transform: scale(1); }
            100% { transform: scale(0.8); }
        }
      `}} />
    </div>
  );
}
