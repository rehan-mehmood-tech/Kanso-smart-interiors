"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, LockKeyhole, Handshake } from "lucide-react";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Vetted Artisan Matching",
    copy: "We check credentials, past work, and client history before a studio ever appears in your matches, so you are only introduced to trades with proven expertise in your room type.",
  },
  {
    icon: LockKeyhole,
    title: "Locked Scope & Price",
    copy: "Because the AI produces exact material specifications, your scope is fixed before work begins. No arbitrary change orders halfway through the build.",
  },
  {
    icon: Handshake,
    title: "Transparent Procurement",
    copy: "Signature materials are sourced directly through Kanso, which means wholesale pricing, verified authenticity, and no mystery markup on the invoice.",
  },
];

export function ArtisanTrustSection() {
  return (
    <section id="artisans" className="w-full scroll-mt-16 bg-[#fbf9f4] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mx-auto mb-16 w-full max-w-2xl text-center">
          <span className="font-body text-xs tracking-[0.2em] text-[#1b1c19]/45 uppercase">
            Execution
          </span>
          <h2 className="mt-5 font-serif text-3xl leading-tight text-[#1b1c19] sm:text-4xl">
            Expert Execution, Guaranteed
          </h2>
          <p className="mx-auto mt-5 w-full max-w-[36rem] font-body text-base leading-relaxed text-[#1b1c19]/65">
            Your concept is only ever as good as the hands that build it, so we treat the
            handoff to a specialist as part of the design.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="flex w-full cursor-default flex-col rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea] p-7 transition-colors duration-300 hover:border-[#1b1c19] hover:shadow-lg"
              >
                <Icon className="mb-6 h-7 w-7 shrink-0 text-[#1b1c19]" />
                <h3 className="font-body text-lg font-semibold text-[#1b1c19]">
                  {pillar.title}
                </h3>
                <p className="mt-3 w-full font-body text-sm leading-relaxed text-[#1b1c19]/65">
                  {pillar.copy}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
