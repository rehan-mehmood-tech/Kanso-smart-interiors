"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { KansoLogo } from "@/components/brand/KansoLogo";

const COLUMNS = [
  {
    heading: "Explore",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "Explore Styles", href: "#explore" },
      { label: "Artisans", href: "#artisans" },
      { label: "Impact", href: "#impact" },
    ],
  },
  {
    heading: "Product",
    links: [
      { label: "Design My Room", href: "/project/new/room-type" },
      { label: "Pricing", href: "/pricing" },
      { label: "My Spaces", href: "/dashboard" },
      { label: "Log In", href: "/login" },
    ],
  },
  {
    heading: "Partners",
    links: [
      { label: "Artisan Portal", href: "/pro/dashboard" },
      { label: "Partner Profile", href: "/pro/profile" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function Footer() {
  const toTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <footer className="w-full border-t border-[#c4c7c7] bg-[#f4f0ea]">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <KansoLogo />
            <p className="mt-6 w-full max-w-[28rem] font-body text-sm leading-relaxed text-[#1b1c19]/65">
              Kanso exists to close the gap between imagining a room and actually
              building it. We turn four photographs into architectural-grade concepts,
              cost them against materials you can genuinely source, and hand the result
              to a specialist who quotes on craft instead of guesswork.
            </p>
            <p className="mt-5 w-full max-w-[28rem] font-body text-sm leading-relaxed text-[#1b1c19]/50">
              Renders are visual concepts, not construction drawings or
              measurement-accurate plans.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {COLUMNS.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <h3 className="font-body text-xs font-semibold tracking-[0.16em] text-[#1b1c19] uppercase">
                  {column.heading}
                </h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {column.links.map((link) =>
                    link.href.startsWith("#") ? (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="font-body text-sm whitespace-nowrap text-[#1b1c19]/65 transition-colors hover:text-[#1b1c19]"
                        >
                          {link.label}
                        </a>
                      </li>
                    ) : (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="font-body text-sm whitespace-nowrap text-[#1b1c19]/65 transition-colors hover:text-[#1b1c19]"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-[#c4c7c7] pt-8 sm:flex-row">
          <p className="font-body text-sm text-[#1b1c19]/55">
            &copy; 2026 Kanso Smart Interiors. All rights reserved.
          </p>
          <button
            type="button"
            onClick={toTop}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#c4c7c7] px-5 py-2.5 font-body text-sm font-medium whitespace-nowrap text-[#1b1c19] transition-colors hover:bg-[#fbf9f4]"
          >
            Back to Top
            <ArrowUp className="h-4 w-4 shrink-0" />
          </button>
        </div>
      </div>
    </footer>
  );
}
