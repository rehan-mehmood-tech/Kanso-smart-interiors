import React from "react";
import Link from "next/link";

export function BottomCtaSection() {
  return (
    <section className="w-full py-20 lg:py-28 bg-[#fbf9f4]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        <h2 className="font-serif text-4xl sm:text-5xl font-light tracking-tight text-[#1b1c19] mb-6 leading-[1.1]">
          Ready to see your space reimagined?
        </h2>
        <p className="font-body text-lg text-[#1b1c19]/80 mb-10 max-w-2xl leading-relaxed">
          Upload four photos of your room and let our spatial intelligence generate your bespoke architectural concept in seconds.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/project/new/capture"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-[#1b1c19] text-white font-body text-sm font-medium rounded-lg hover:bg-black transition-all duration-300 w-full sm:w-auto"
          >
            Design My Room &rarr;
          </Link>
          <Link 
            href="/pro/dashboard"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-[#fbf9f4] text-[#1b1c19] border border-[#1b1c19] font-body text-sm font-medium rounded-lg hover:bg-[#f4f0ea] transition-all duration-300 w-full sm:w-auto"
          >
            I&apos;m a Professional
          </Link>
        </div>
      </div>
    </section>
  );
}

