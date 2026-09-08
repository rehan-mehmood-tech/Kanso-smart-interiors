import React from 'react';
import { Bell, Menu, Circle } from 'lucide-react';
import { KansoLogo } from "@/components/brand/KansoLogo";

export function ProHeader() {
  return (
    <>
      {/* TopAppBar (Mobile Only) */}
      <header className="lg:hidden flex justify-between items-center h-16 px-4 border-b border-[#c4c7c7]/50 bg-[#f4f0ea]/85 backdrop-blur-md sticky top-0 z-50 -mx-4 md:-mx-8 mb-8">
        <KansoLogo />
        <button className="text-primary p-2">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Desktop Welcome Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="font-display-xl text-4xl md:text-[48px] leading-tight tracking-tight text-on-surface mb-2">
            Welcome back, Architect.
          </h1>
          <p className="font-body-md text-body-md text-secondary">
            Here's what's happening with your studio today.
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden md:flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-full border border-outline-variant/30 shadow-sm">
            <Circle className="w-2.5 h-2.5 text-green-500 fill-current" />
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary">Accepting Leads</span>
          </div>
          <button className="relative p-2 text-secondary hover:text-primary transition-colors bg-surface-container-lowest rounded-full border border-outline-variant/30 shadow-sm">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-[1.5px] border-[#ffffff]"></span>
          </button>
        </div>
      </section>
    </>
  );
}
