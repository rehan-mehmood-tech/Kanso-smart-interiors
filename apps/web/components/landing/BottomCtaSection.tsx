import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BottomCtaSection() {
  return (
    <section className="w-full bg-[#fbf9f4] py-20 lg:py-28">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center sm:px-8">
        <h2 className="w-full max-w-3xl font-serif text-2xl leading-[1.12] font-light tracking-tight text-[#1b1c19] sm:text-4xl md:text-5xl">
          Ready to see your space reimagined?
        </h2>
        <p className="mt-6 w-full max-w-2xl font-body text-base leading-relaxed text-[#1b1c19]/70 sm:text-lg">
          Upload four photos of your room and let our spatial intelligence generate your
          bespoke architectural concept, complete with a material specification you can
          actually take to a supplier.
        </p>

        <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Link
            href="/project/new/room-type"
            className="group inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#1b1c19] px-8 py-3.5 font-body text-sm font-medium text-white transition-all duration-500 hover:bg-black sm:w-auto"
          >
            Design My Room
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/pro/dashboard"
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-2xl border border-[#1b1c19] bg-[#fbf9f4] px-8 py-3.5 font-body text-sm font-medium whitespace-nowrap text-[#1b1c19] transition-all duration-500 hover:bg-[#f4f0ea] sm:w-auto"
          >
            I&apos;m a Professional
          </Link>
        </div>
      </div>
    </section>
  );
}
