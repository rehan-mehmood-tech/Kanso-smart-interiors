import React from "react";
import { TestimonialMarquee } from "@/components/landing/TestimonialMarquee";
import { RateAppCta } from "@/components/landing/RateAppCta";

export function VoicesSection() {
  return (
    <section className="w-full overflow-hidden bg-[#f4f0ea] py-20 sm:py-28">
      <div className="mx-auto mb-14 w-full max-w-2xl px-6 text-center sm:px-8">
        <span className="font-body text-xs tracking-[0.2em] text-[#1b1c19]/45 uppercase">
          Voices
        </span>
        <h2 className="mt-5 font-serif text-3xl leading-tight text-[#1b1c19] sm:text-4xl">
          From Both Sides of the Room
        </h2>
        <p className="mx-auto mt-5 w-full max-w-[36rem] font-body text-base leading-relaxed text-[#1b1c19]/65">
          Homeowners who stopped guessing, and the specialists who finally received a
          brief they could build from.
        </p>
      </div>

      <TestimonialMarquee />

      <div className="mt-14 px-6 sm:px-8">
        <RateAppCta />
      </div>
    </section>
  );
}
