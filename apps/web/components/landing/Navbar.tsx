"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";

const NAV_ANCHORS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Explore Styles", href: "#explore" },
  { label: "Artisans", href: "#artisans" },
  { label: "Impact", href: "#impact" },
];

const linkClass =
  "font-body text-sm font-medium whitespace-nowrap text-[#1b1c19]/70 transition-colors duration-300 hover:text-[#1b1c19]";

export function Navbar() {
  const [open, setOpen] = useState(false);

  // Close on Escape and lock background scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <SiteHeader
        nav={
          <>
            {NAV_ANCHORS.map((item) => (
              <a key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </a>
            ))}
            <Link href="/pricing" className={linkClass}>
              Pricing
            </Link>
          </>
        }
      >
        <Link href="/login" className={`hidden lg:block ${linkClass}`}>
          Log In
        </Link>
        {/* CTA is desktop-only; on mobile it lives inside the drawer so the
            header never outgrows a 320px viewport. */}
        <Link
          href="/project/new/room-type"
          className="hidden min-h-[44px] items-center rounded-2xl bg-[#1b1c19] px-5 py-2 font-body text-sm font-medium whitespace-nowrap text-white transition-colors duration-300 hover:bg-black lg:inline-flex"
        >
          Design My Room
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#c4c7c7] text-[#1b1c19] transition-colors hover:bg-[#fbf9f4] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SiteHeader>

      {/* Mobile slide-over drawer */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 h-full w-full cursor-default bg-[#1b1c19]/45 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          role="dialog"
          aria-modal={open}
          aria-label="Site menu"
          className={`absolute top-0 right-0 flex h-full w-[86%] max-w-[20rem] flex-col border-l border-[#c4c7c7] bg-[#f4f0ea] shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#c4c7c7] px-5">
            <span className="font-body text-xs font-semibold tracking-[0.18em] text-[#1b1c19]/55 uppercase">
              Menu
            </span>
            <button
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#c4c7c7] text-[#1b1c19] transition-colors hover:bg-[#fbf9f4]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
            {NAV_ANCHORS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center rounded-2xl px-4 py-3 font-body text-base font-medium text-[#1b1c19]/80 transition-colors hover:bg-[#fbf9f4] hover:text-[#1b1c19]"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/pricing"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="flex min-h-[44px] items-center rounded-2xl px-4 py-3 font-body text-base font-medium text-[#1b1c19]/80 transition-colors hover:bg-[#fbf9f4] hover:text-[#1b1c19]"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex shrink-0 flex-col gap-3 border-t border-[#c4c7c7] p-4">
            <Link
              href="/project/new/room-type"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="flex min-h-[44px] w-full items-center justify-center rounded-2xl bg-[#1b1c19] px-5 py-3 font-body text-sm font-medium text-white transition-colors hover:bg-black"
            >
              Design My Room
            </Link>
            <Link
              href="/login"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="flex min-h-[44px] w-full items-center justify-center rounded-2xl border border-[#c4c7c7] px-5 py-3 font-body text-sm font-medium text-[#1b1c19] transition-colors hover:bg-[#fbf9f4]"
            >
              Log In
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
