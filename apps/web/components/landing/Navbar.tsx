import React from "react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-[#fbf9f4] border-b border-[#c4c7c7] flex justify-between items-center h-20 px-6 sm:px-8 lg:px-12">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-serif text-2xl tracking-tight text-[#1b1c19] hover:opacity-80 transition-opacity font-medium">
          KANSO
        </Link>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <Link href="#how-it-works" className="text-[#1b1c19]/70 hover:text-[#1b1c19] transition-colors duration-300 font-body text-sm font-medium">
          How It Works
        </Link>
        <Link href="#explore" className="text-[#1b1c19]/70 hover:text-[#1b1c19] transition-colors duration-300 font-body text-sm font-medium">
          Explore Styles
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-[#1b1c19]/70 hover:text-[#1b1c19] transition-colors duration-300 font-body text-sm font-medium hidden sm:block">
          Log In
        </Link>
        <Link href="/project/new/capture" className="bg-[#1b1c19] text-white px-6 py-2.5 rounded-lg font-body text-sm font-medium hover:bg-black transition-colors duration-300">
          Design My Room
        </Link>
      </div>
    </nav>
  );
}

