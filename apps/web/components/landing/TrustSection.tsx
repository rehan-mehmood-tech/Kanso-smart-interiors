import React from "react";
import { ShieldCheck, LockKeyhole, Handshake } from "lucide-react";

export function TrustSection() {
  return (
    <section className="w-full py-20 lg:py-28 bg-[#fbf9f4]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight text-[#1b1c19] mb-4">
            Expert Execution, Guaranteed
          </h2>
          <p className="max-w-xl mx-auto font-body text-base text-[#1b1c19]/80 leading-relaxed">
            Your concept is only as good as the hands that build it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#f4f0ea] border border-[#c4c7c7] p-8 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-[#1b1c19] mb-6" />
            <h3 className="font-serif text-xl text-[#1b1c19] mb-3">Vetted Artisan Matching</h3>
            <p className="font-body text-sm text-[#1b1c19]/70 leading-relaxed">
              We stringently vet local studios and contractors, matching you only with partners who have proven expertise.
            </p>
          </div>
          
          <div className="bg-[#f4f0ea] border border-[#c4c7c7] p-8 rounded-2xl">
            <LockKeyhole className="w-8 h-8 text-[#1b1c19] mb-6" />
            <h3 className="font-serif text-xl text-[#1b1c19] mb-3">Locked Scope & Price</h3>
            <p className="font-body text-sm text-[#1b1c19]/70 leading-relaxed">
              By generating exact material specs via AI, your project scope is locked upfront. No arbitrary change orders.
            </p>
          </div>

          <div className="bg-[#f4f0ea] border border-[#c4c7c7] p-8 rounded-2xl">
            <Handshake className="w-8 h-8 text-[#1b1c19] mb-6" />
            <h3 className="font-serif text-xl text-[#1b1c19] mb-3">Transparent Procurement</h3>
            <p className="font-body text-sm text-[#1b1c19]/70 leading-relaxed">
              We handle the sourcing of all signature materials directly, ensuring you get wholesale pricing and authentic Kanso quality.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

