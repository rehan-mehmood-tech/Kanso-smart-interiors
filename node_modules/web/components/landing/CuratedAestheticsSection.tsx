"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Standardized aesthetic card: image on top, title, two-line description,
 * palette swatches at the bottom. Every image URL here is unique across the page.
 */
const AESTHETICS = [
  {
    name: "Japandi",
    description:
      "Scandinavian function meets Japanese restraint. Low profiles, pale timber, and deliberate empty space.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    palette: ["#D4CFC7", "#8C8276", "#2D2A26"],
  },
  {
    name: "Warm Minimalist",
    description:
      "Uncluttered rooms kept from feeling cold by natural texture, soft neutrals, and diffused light.",
    image:
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=900&q=80",
    palette: ["#FBF9F4", "#EAE8E3", "#9D9589"],
  },
  {
    name: "Quiet Luxury",
    description:
      "Understated elegance built from bespoke materials, muted palettes, and detailing you notice slowly.",
    image:
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=900&q=80",
    palette: ["#4A4A4A", "#E6E2DA", "#1B1C19"],
  },
  {
    name: "Modern Organic",
    description:
      "Flowing forms and raw natural elements that bring the outdoors into a considered interior.",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    palette: ["#B8A792", "#7A8B76", "#3E362E"],
  },
];

export function CuratedAestheticsSection() {
  return (
    <section id="explore" className="w-full scroll-mt-16 bg-[#fbf9f4] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mx-auto mb-16 w-full max-w-2xl text-center">
          <span className="font-body text-xs tracking-[0.2em] text-[#1b1c19]/45 uppercase">
            Signature Styles
          </span>
          <h2 className="mt-5 font-serif text-2xl leading-tight text-[#1b1c19] sm:text-3xl md:text-4xl">
            Curated Kanso Aesthetics
          </h2>
          <p className="mx-auto mt-5 w-full max-w-[36rem] text-balance font-body text-sm leading-relaxed sm:text-base text-[#1b1c19]/65">
            Every style is tied to a locked database of locally sourceable materials, so
            the look you choose is a look you can actually buy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AESTHETICS.map((style, index) => (
            <motion.article
              key={style.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.8,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.45, ease: "easeOut" } }}
              className="group flex w-full flex-col overflow-hidden rounded-2xl border border-[#c4c7c7] bg-[#fbf9f4] transition-all duration-500 hover:border-[#1b1c19] hover:shadow-lg"
            >
              <div className="aspect-4/5 w-full overflow-hidden bg-[#f4f0ea]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={style.image}
                  alt={`${style.name} interior aesthetic`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col border-t border-[#c4c7c7] p-5">
                <h3 className="font-body text-lg font-semibold text-[#1b1c19]">
                  {style.name}
                </h3>
                <p className="mt-2 w-full flex-1 font-body text-sm leading-relaxed text-[#1b1c19]/65">
                  {style.description}
                </p>

                <div
                  className="mt-5 flex items-center gap-2"
                  aria-label={`${style.name} colour palette`}
                >
                  {style.palette.map((color) => (
                    <span
                      key={color}
                      title={color}
                      className="h-6 w-6 shrink-0 rounded-full border border-[#c4c7c7]"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
