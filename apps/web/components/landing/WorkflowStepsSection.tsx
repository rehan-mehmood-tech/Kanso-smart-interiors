"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles, HardHat } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Camera,
    title: "Capture Space",
    description:
      "Upload four photos of your existing room, one per wall. No measurements, no professional camera, no preparation required.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Style with AI",
    description:
      "Choose an aesthetic. The engine returns hyper-realistic renders of your own room, each backed by a precise material moodboard.",
  },
  {
    number: "03",
    icon: HardHat,
    title: "Specialist Execution",
    description:
      "Lock your design and hand the exact specification to a verified Kanso partner, who quotes against a scope that cannot drift.",
  },
];

export function WorkflowStepsSection() {
  return (
    <section
      id="how-it-works"
      className="w-full scroll-mt-16 bg-[#f4f0ea] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mx-auto mb-16 w-full max-w-2xl text-center">
          <span className="font-body text-xs tracking-[0.2em] text-[#1b1c19]/45 uppercase">
            The Process
          </span>
          <h2 className="mt-5 font-serif text-3xl leading-tight text-[#1b1c19] sm:text-4xl">
            How Space Becomes Reality
          </h2>
          <p className="mx-auto mt-5 w-full max-w-[36rem] font-body text-base leading-relaxed text-[#1b1c19]/65">
            A streamlined three-step journey from imagination to execution, guided by
            spatial intelligence and finished by vetted experts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="flex w-full cursor-default flex-col items-start rounded-2xl border border-[#c4c7c7] bg-[#fbf9f4] p-7 text-left transition-colors duration-300 hover:border-[#1b1c19] hover:shadow-lg"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#c4c7c7] bg-[#f4f0ea] text-[#1b1c19]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-serif text-3xl text-[#1b1c19]/15">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 font-body text-lg font-semibold text-[#1b1c19]">
                  {step.title}
                </h3>
                <p className="mt-2.5 w-full font-body text-sm leading-relaxed text-[#1b1c19]/65">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
