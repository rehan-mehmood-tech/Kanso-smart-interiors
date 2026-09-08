import React from "react";

/** Kanso wordmark — enso-inspired mark plus the full "Smart Interiors" lockup. */
export function KansoLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="h-7 w-7 shrink-0"
        fill="none"
      >
        <rect width="64" height="64" rx="14" fill="#1b1c19" />
        <circle
          cx="32"
          cy="32"
          r="17"
          fill="none"
          stroke="#fbf9f4"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="80 27"
          transform="rotate(-32 32 32)"
        />
        <path
          d="M32 15 L32 49"
          stroke="#fbf9f4"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-xl tracking-tight text-[#1b1c19]">
          KANSO
        </span>
        <span className="font-body text-[10px] uppercase tracking-[0.18em] text-[#1b1c19]/55">
          Smart Interiors
        </span>
      </span>
    </span>
  );
}
