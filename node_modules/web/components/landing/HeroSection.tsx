"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ShimmerText } from "@/components/ui/shimmer-text";

/**
 * Verified Pexels CDN clips. Each slide carries its own hook + solution copy,
 * which swaps in sync with the video transition.
 */
const SLIDES = [
  {
    id: "japandi",
    label: "Japandi",
    src: "/assets/videos/hero-japandi.mp4",
    poster:
      "/assets/images/hero/poster-japandi.jpg",
    hook: "From Fragmented 2D Blueprints to Price-Locked 4-Wall Spatial Reality",
    homeowner:
      "Eliminate visual guesswork, material budget overrun, and contractor ambiguity before buying a single item.",
    business:
      "Lock exact spatial specs, streamline execution, and eliminate unbillable site delays with verified trade partners.",
  },
  {
    id: "minimalist",
    label: "Warm Minimalist",
    src: "/assets/videos/hero-warm-minimalist.mp4",
    poster:
      "/assets/images/hero/poster-warm-minimalist.jpg",
    hook: "Stop Paying Full Price for a Room You Have Only Ever Imagined",
    homeowner:
      "See your own walls, your own light, and your own proportions resolved into a finished concept before a single order is placed.",
    business:
      "Quote against an approved render and a costed bill of materials instead of a screenshot, a sentence, and an assumption.",
  },
  {
    id: "luxury",
    label: "Quiet Luxury",
    src: "/assets/videos/hero-quiet-luxury.mp4",
    poster:
      "/assets/images/hero/poster-quiet-luxury.jpg",
    hook: "Every Finish Named, Sourced and Costed Before the First Tool Is Lifted",
    homeowner:
      "Walk into a supplier knowing the exact material, quantity and price, so the room you fell in love with is the room you can actually afford.",
    business:
      "Receive scope-locked briefs with the budget already agreed, so change orders stop being an argument you have to win.",
  },
  {
    id: "organic",
    label: "Modern Organic",
    src: "/assets/videos/hero-modern-organic.mp4",
    poster:
      "/assets/images/hero/poster-modern-organic.jpg",
    hook: "Where Spatial Imagination Finally Hands Off Cleanly to Execution",
    homeowner:
      "Four wall photos become architectural-grade concepts that preserve your geometry, your doors and your windows, not a stock catalogue interior.",
    business:
      "Renders, material schedules, wall-by-wall captures and client budget arrive as one pre-vetted package before the first site visit.",
  },
  {
    id: "editorial",
    label: "Editorial Neutral",
    src: "/assets/videos/hero-editorial-neutral.mp4",
    poster:
      "/assets/images/hero/poster-editorial-neutral.jpg",
    hook: "Price-Locked Transparency From the First Render to the Final Invoice",
    homeowner:
      "No arbitrary change orders, no mystery markup, and no five-month overrun on a six-week project.",
    business:
      "Estimate on craft rather than risk, because the ambiguity you used to pad against has already been designed out.",
  },
];

const SLIDE_MS = 10000;

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-advance; restarts on every index change, including manual control.
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => go(index + 1), SLIDE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [index, go]);

  const slide = SLIDES[index];

  return (
    // Navbar (4rem) + hero + ticker (2.75rem) === 100vh above the fold.
    <section className="relative w-full overflow-hidden bg-[#1b1c19]">
      <div className="relative flex min-h-[calc(100svh-6.75rem)] w-full max-w-full flex-col lg:block lg:h-[calc(100vh-6.75rem)]">
        {SLIDES.map((clip, i) => (
          <video
            key={clip.id}
            src={clip.src}
            poster={clip.poster}
            autoPlay
            muted
            loop
            playsInline
            preload={i === 0 ? "auto" : "metadata"}
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1500ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Left-weighted legibility mask — video stays visible on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b1c19]/85 via-[#1b1c19]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c19]/55 via-transparent to-transparent" />

        <div className="relative z-10 flex w-full flex-1 items-center py-12 lg:h-full lg:py-0">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 lg:pl-16">
            <div className="w-full max-w-[38rem] text-left">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.8 }}
                className="mb-4 inline-block rounded-2xl border border-white/25 bg-white/10 px-4 py-1.5 font-body text-[11px] font-medium tracking-[0.14em] text-white/90 uppercase backdrop-blur-sm"
              >
                Spatial AI · Verified Artisans
              </motion.span>

              {/* Dynamic narrative — swaps with each video transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h1 className="font-serif text-2xl leading-[1.12] font-bold text-white sm:text-3xl md:text-4xl lg:text-[2.9rem]">
                    <ShimmerText duration={4} delay={0.4}>
                      {slide.hook}
                    </ShimmerText>
                  </h1>

                  <div className="mt-6 w-full max-w-[34rem] space-y-3">
                    <p className="w-full text-balance font-body text-sm leading-relaxed text-white/85 md:text-base">
                      {slide.homeowner}
                    </p>
                    <p className="w-full text-balance font-body text-sm leading-relaxed text-white/85 md:text-base">
                      {slide.business}
                    </p>
                  </div>

                </motion.div>
              </AnimatePresence>

              <div className="mt-7 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/project/new/room-type"
                  className="group inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-[#fbf9f4] px-6 py-3.5 font-body text-sm font-semibold text-[#1b1c19] transition-all duration-500 hover:bg-white sm:w-auto sm:px-7"
                >
                  Start Room Transformation
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href="#artisans"
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-2xl border border-white/35 px-6 py-3.5 font-body text-sm font-medium whitespace-nowrap text-white backdrop-blur-sm transition-colors duration-500 hover:bg-white/10 sm:w-auto sm:px-7"
                >
                  Explore Artisan Network
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Manual carousel controls */}
        <div className="absolute right-4 bottom-5 z-20 hidden items-center gap-3 sm:right-10 sm:flex">
          <span className="mr-2 hidden font-body text-xs tracking-[0.14em] whitespace-nowrap text-white/70 uppercase sm:inline">
            {slide.label}
          </span>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous aesthetic"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next aesthetic"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute bottom-5 left-5 z-20 flex gap-2 sm:left-8 lg:left-16">
          {SLIDES.map((clip, i) => (
            <button
              key={clip.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${clip.label}`}
              aria-current={i === index}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index ? "w-10 bg-white" : "w-5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
