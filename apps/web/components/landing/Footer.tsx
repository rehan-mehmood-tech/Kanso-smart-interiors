import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full pt-16 pb-12 border-t border-stone-200 mt-24 bg-[#fbf9f4]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-2">
          <span className="font-serif text-xl tracking-tight text-[#1b1c19]">
            KANSO
          </span>
          <p className="font-body text-sm text-[#1b1c19]/60">
            &copy; 2026 Kanso Living. All rights reserved.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link href="/privacy" className="font-body text-sm text-[#1b1c19]/70 hover:text-[#1b1c19] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="font-body text-sm text-[#1b1c19]/70 hover:text-[#1b1c19] transition-colors">
            Terms of Service
          </Link>
          <Link href="/pro/dashboard" className="font-body text-sm text-[#1b1c19] hover:text-[#1b1c19]/80 transition-colors font-medium">
            Artisan Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}

