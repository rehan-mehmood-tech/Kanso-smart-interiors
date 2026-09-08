"use client";
import Image from 'next/image';
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { KansoLogo } from "@/components/brand/KansoLogo";

export default function myspaceskansoPage() {
  return (
    <>
      
{/* TopNavBar */}
<SiteHeader>
<Link href="/project/new/room-type" className="rounded-2xl bg-[#1b1c19] px-5 py-2 font-body text-sm font-medium whitespace-nowrap text-white transition-colors duration-300 hover:bg-black">Design My Room</Link>
</SiteHeader>
{/* Main Content */}
<main className="max-w-container-max-app mx-auto px-margin-mobile md:px-lg py-xl md:py-xxl">
{/* Header Section */}
<header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
<div>
<h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">My Spaces</h1>
<p className="font-body-md text-body-md text-secondary">Manage and explore your interior design projects.</p>
</div>
<button className="px-md py-sm bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:bg-primary-container transition-colors flex items-center gap-sm">
<span className="material-symbols-outlined text-[16px]">add</span>
                Design a New Room
            </button>
</header>
{/* Project Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
{/* Card 1 */}
<article className="bg-surface-container-lowest rounded-[16px] ambient-shadow border border-outline-variant/30 overflow-hidden group cursor-pointer flex flex-col">
<div className="relative w-full h-[280px] overflow-hidden bg-surface-container-low">
<Image src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80" alt="Living Room Retreat" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
</div>
<div className="p-lg flex flex-col flex-grow">
<div className="flex justify-between items-start mb-sm">
<h2 className="font-headline-md text-headline-md text-primary">Living Room Retreat</h2>
<span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
</div>
<div className="flex gap-sm mb-md flex-wrap">
<span className="px-sm py-xs border border-outline-variant rounded-[4px] font-label-sm text-label-sm text-secondary">Japandi</span>
<span className="px-sm py-xs border border-outline-variant rounded-[4px] font-label-sm text-label-sm text-secondary">3 Concepts</span>
</div>
<p className="font-body-md text-body-md text-secondary mt-auto text-sm">Last updated 2 days ago</p>
</div>
</article>
{/* Card 2 */}
<article className="bg-surface-container-lowest rounded-[16px] ambient-shadow border border-outline-variant/30 overflow-hidden group cursor-pointer flex flex-col">
<div className="relative w-full h-[280px] overflow-hidden bg-surface-container-low">
<Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80" alt="Master Bedroom" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
</div>
<div className="p-lg flex flex-col flex-grow">
<div className="flex justify-between items-start mb-sm">
<h2 className="font-headline-md text-headline-md text-primary">Master Bedroom</h2>
<span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
</div>
<div className="flex gap-sm mb-md flex-wrap">
<span className="px-sm py-xs border border-outline-variant rounded-[4px] font-label-sm text-label-sm text-secondary">Warm Minimalist</span>
<span className="px-sm py-xs border border-outline-variant rounded-[4px] font-label-sm text-label-sm text-secondary">1 Concept</span>
</div>
<p className="font-body-md text-body-md text-secondary mt-auto text-sm">Last updated 1 week ago</p>
</div>
</article>
{/* Card 3 */}
<article className="bg-surface-container-lowest rounded-[16px] ambient-shadow border border-outline-variant/30 overflow-hidden group cursor-pointer flex flex-col">
<div className="relative w-full h-[280px] overflow-hidden bg-surface-container-low flex items-center justify-center">
<Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80" alt="Kitchen Remodel" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" />
</div>
<div className="p-lg flex flex-col flex-grow">
<div className="flex justify-between items-start mb-sm">
<h2 className="font-headline-md text-headline-md text-primary">Kitchen Remodel</h2>
<span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
</div>
<div className="flex gap-sm mb-md flex-wrap">
<span className="px-sm py-xs border border-outline-variant rounded-[4px] font-label-sm text-label-sm text-secondary">Modern Architecture</span>
<span className="px-sm py-xs border border-outline-variant rounded-[4px] font-label-sm text-label-sm text-secondary">5 Concepts</span>
</div>
<p className="font-body-md text-body-md text-secondary mt-auto text-sm">Last updated 2 weeks ago</p>
</div>
</article>
</div>
</main>
{/* Footer */}
<footer className="bg-surface-container-lowest border-t border-outline-variant py-xl">
<div className="max-w-container-max-marketing mx-auto px-lg flex flex-col md:flex-row justify-between items-center gap-md">
<KansoLogo />
<div className="flex gap-md">
<a className="text-secondary hover:text-primary transition-colors font-body-md text-body-md" href="#">Privacy Policy</a>
<a className="text-secondary hover:text-primary transition-colors font-body-md text-body-md" href="#">Terms of Service</a>
<a className="text-secondary hover:text-primary transition-colors font-body-md text-body-md" href="#">Cookies</a>
</div>
<span className="text-secondary font-body-md text-body-md">© 2024 Kanso AI. All rights reserved.</span>
</div>
</footer>

    </>
  );
}
