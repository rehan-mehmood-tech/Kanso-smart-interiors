"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { KansoLogo } from "@/components/brand/KansoLogo";

const NAV_ANCHORS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Explore Styles", href: "#explore" },
  { label: "Artisans", href: "#artisans" },
  { label: "Impact", href: "#impact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-[#f4f0ea]/85 backdrop-blur-md border-b border-[#c4c7c7] transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_20px_rgba(27,28,25,0.06)]" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6 py-3 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Kanso Smart Interiors — home" className="transition-opacity hover:opacity-80">
          <KansoLogo />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_ANCHORS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-body text-sm font-medium whitespace-nowrap text-[#1b1c19]/70 transition-colors duration-300 hover:text-[#1b1c19]"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/pricing"
            className="font-body text-sm font-medium whitespace-nowrap text-[#1b1c19]/70 transition-colors duration-300 hover:text-[#1b1c19]"
          >
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden font-body text-sm font-medium whitespace-nowrap text-[#1b1c19]/70 transition-colors duration-300 hover:text-[#1b1c19] sm:block"
          >
            Log In
          </Link>
          <Link
            href="/project/new/room-type"
            className="rounded-2xl bg-[#1b1c19] px-5 py-2 font-body text-sm font-medium whitespace-nowrap text-white transition-colors duration-300 hover:bg-black"
          >
            Design My Room
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="rounded-2xl border border-[#c4c7c7] p-2 text-[#1b1c19] transition-colors hover:bg-[#fbf9f4] lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#c4c7c7] bg-[#f4f0ea]/95 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4 sm:px-8">
            {NAV_ANCHORS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-3 font-body text-sm font-medium text-[#1b1c19]/80 transition-colors hover:bg-[#fbf9f4] hover:text-[#1b1c19]"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-3 py-3 font-body text-sm font-medium text-[#1b1c19]/80 transition-colors hover:bg-[#fbf9f4] hover:text-[#1b1c19]"
            >
              Pricing
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
