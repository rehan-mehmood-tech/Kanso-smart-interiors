import React from "react";
import { ShieldCheck, LockKeyhole, Handshake } from "lucide-react";

export function ArtisanTrustSection() {
  return (
    <section className="w-full py-20 sm:py-24 bg-[#fbf9f4]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1b1c19]">
            Expert Execution, Guaranteed.
          </h2>
          <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed">
            Your concept is only as good as the hands that build it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#f4f0ea] border border-[#c4c7c7]">
            <ShieldCheck className="w-8 h-8 text-[#1b1c19] mb-6" />
            <h3 className="text-xl font-medium text-[#1b1c19] mb-3">Vetted Artisan Matching</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              We stringently vet local studios and contractors, matching you only with partners who have proven expertise.
            </p>
          </div>
          
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#f4f0ea] border border-[#c4c7c7]">
            <LockKeyhole className="w-8 h-8 text-[#1b1c19] mb-6" />
            <h3 className="text-xl font-medium text-[#1b1c19] mb-3">Locked Scope & Price</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              By generating exact material specs via AI, your project scope is locked upfront. No arbitrary change orders.
            </p>
          </div>

          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#f4f0ea] border border-[#c4c7c7]">
            <Handshake className="w-8 h-8 text-[#1b1c19] mb-6" />
            <h3 className="text-xl font-medium text-[#1b1c19] mb-3">Transparent Procurement</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              We handle the sourcing of all signature materials directly, ensuring you get wholesale pricing and authentic Kanso quality.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

