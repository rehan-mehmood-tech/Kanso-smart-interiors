import React from "react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="w-full py-20 sm:py-24 bg-[#fbf9f4]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#1b1c19] leading-tight">
              Design with Absolute Clarity
            </h1>
            
            <p className="max-w-xl text-base sm:text-lg text-stone-600 leading-relaxed mt-6">
              Reimagine your living space with architectural precision before spending a single rupee. Upload your current room, curate custom material aesthetics, and connect directly with verified artisan specialists.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link 
                href="/project/new/capture"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#1b1c19] text-white font-body text-sm font-medium rounded-lg hover:bg-black transition-all duration-300"
              >
                Design My Room &rarr;
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm bg-[#f4f0ea]">
            <img 
              src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85" 
              alt="High-end Kanso living room"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

