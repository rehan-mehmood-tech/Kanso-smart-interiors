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
    src: "https://videos.pexels.com/video-files/3773486/3773486-hd_1920_1080_30fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80",
    hook: "Struggling to picture your space?",
    solution:
      "Kanso turns four wall photos into architectural-grade renders of your actual room, in the aesthetic you choose.",
  },
  {
    id: "minimalist",
    label: "Warm Minimalist",
    src: "https://videos.pexels.com/video-files/7578552/7578552-hd_1920_1080_30fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1600&q=80",
    hook: "Tired of contractor delays?",
    solution:
      "Every concept ships with a locked material scope, so your specialist quotes once and the number holds.",
  },
  {
    id: "luxury",
    label: "Quiet Luxury",
    src: "https://videos.pexels.com/video-files/3444434/3444434-hd_1920_1080_30fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80",
    hook: "Buying furniture blind?",
    solution:
      "See the palette, the finish and the full cost against your own walls before a single order is placed.",
  },
  {
    id: "organic",
    label: "Modern Organic",
    src: "https://videos.pexels.com/video-files/3773489/3773489-hd_1920_1080_30fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=1600&q=80",
    hook: "Losing clients to bad briefs?",
    solution:
      "Artisans and businesses receive pre-vetted, scope-locked projects — renders, materials and budget in one package.",
  },
  {
    id: "editorial",
    label: "Editorial Neutral",
    src: "https://videos.pexels.com/video-files/7578550/7578550-hd_1920_1080_30fps.mp4",
    poster:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1600&q=80",
    hook: "Guessing what it will cost?",
    solution:
      "Price-locked transparency from the first render to the final invoice, whether you are a homeowner or a business owner.",
  },
];

const SLIDE_MS = 9000;

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
      <div className="relative h-[calc(100vh-6.75rem)] min-h-[440px] w-full">
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
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {/* Left-weighted legibility mask — video stays visible on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b1c19]/85 via-[#1b1c19]/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c19]/55 via-transparent to-transparent" />

        <div className="relative z-10 flex h-full items-center">
          <div className="w-full max-w-7xl px-6 pl-8 sm:px-8 lg:px-12 lg:pl-16">
            <div className="w-full max-w-[36rem] text-left">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.7 }}
                className="mb-5 inline-block rounded-2xl border border-white/25 bg-white/10 px-4 py-1.5 font-body text-[11px] font-medium tracking-[0.14em] text-white/90 uppercase backdrop-blur-sm"
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
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h1 className="font-serif text-4xl leading-[1.05] font-bold text-white sm:text-5xl lg:text-[3.5rem]">
                    <ShimmerText duration={2.2} delay={0.3}>
                      {slide.hook}
                    </ShimmerText>
                  </h1>

                  <p className="mt-5 w-full max-w-[32rem] font-body text-base leading-relaxed font-medium text-white/85 sm:text-lg">
                    {slide.solution}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/project/new/room-type"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#fbf9f4] px-7 py-3.5 font-body text-sm font-semibold text-[#1b1c19] transition-all duration-300 hover:bg-white"
                >
                  Design My Room
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/35 px-7 py-3.5 font-body text-sm font-medium whitespace-nowrap text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/10"
                >
                  See How It Works
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Manual carousel controls */}
        <div className="absolute right-6 bottom-6 z-20 flex items-center gap-3 sm:right-10">
          <span className="mr-2 hidden font-body text-xs tracking-[0.14em] whitespace-nowrap text-white/70 uppercase sm:inline">
            {slide.label}
          </span>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous aesthetic"
            className="rounded-2xl border border-white/30 bg-white/10 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/25"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next aesthetic"
            className="rounded-2xl border border-white/30 bg-white/10 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/25"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute bottom-6 left-8 z-20 flex gap-2 lg:left-16">
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
