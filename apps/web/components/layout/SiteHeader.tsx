import React from "react";
import Link from "next/link";
import { KansoLogo } from "@/components/brand/KansoLogo";

export interface SiteHeaderProps {
  /** Right-hand actions (CTAs, close buttons, avatars). */
  children?: React.ReactNode;
  /** Optional centre navigation slot. */
  nav?: React.ReactNode;
  /**
   * "sticky" occupies layout flow (landing, auth).
   * "fixed" overlays content — pages using it need a top spacer of pt-24.
   */
  position?: "sticky" | "fixed";
  className?: string;
}

/**
 * The single standardized brand header. Every route renders this, so the mark,
 * the "KANSO / SMART INTERIORS" lockup, the 64px height and the glass treatment
 * stay identical across the whole application.
 */
export function SiteHeader({
  children,
  nav,
  position = "sticky",
  className = "",
}: SiteHeaderProps) {
  const positionClass =
    position === "fixed"
      ? "fixed top-0 right-0 left-0"
      : "sticky top-0";

  return (
    <header
      className={`${positionClass} z-50 h-16 w-full max-w-full overflow-x-hidden border-b border-[#c4c7c7]/50 bg-[#f4f0ea]/85 backdrop-blur-md ${className}`}
    >
      <div className="mx-auto flex h-16 max-w-full items-center justify-between gap-3 px-4 py-2.5 sm:gap-6 sm:px-8 lg:max-w-7xl lg:px-12">
        <Link
          href="/"
          aria-label="Kanso Smart Interiors — home"
          className="shrink-0 transition-opacity hover:opacity-80"
        >
          <KansoLogo />
        </Link>

        {nav ? (
          <div className="hidden items-center gap-8 lg:flex">{nav}</div>
        ) : null}

        <div className="flex min-w-0 shrink items-center justify-end gap-2 sm:gap-3">{children}</div>
      </div>
    </header>
  );
}
