"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  UserRound,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// Only routes that exist. A sidebar full of dead "#" links teaches vendors
// that the navigation is decorative.
const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/pro/dashboard', icon: LayoutDashboard },
  { label: 'Inventory & Catalog', href: '/pro/inventory', icon: Package },
  { label: 'Schedule', href: '/pro/schedule', icon: CalendarDays },
  { label: 'Profile', href: '/pro/profile', icon: UserRound },
];

export function ProSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Partner workspace"
      className="hidden lg:flex flex-col h-[calc(100vh-4rem)] p-4 space-y-4 fixed left-0 top-16 w-64 bg-[#F0EEE9] border-r border-[#EAE8E3] shrink-0 z-20"
    >
      <div className="flex items-center gap-2 mb-4 px-2 pt-2">
        <span className="font-body text-xs font-semibold tracking-[0.18em] text-[#1b1c19]/55 uppercase">
          Partner Workspace
        </span>
      </div>

      <div className="flex items-center gap-4 px-2 py-4 border-b border-[#EAE8E3] mb-4">
        <div className="relative w-10 h-10 rounded-full bg-[#E4E2DD] overflow-hidden shrink-0 border border-[#C4C7C7]">
          <Image
            src="/assets/images/rooms/interior-wide-1.jpg"
            alt=""
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-body-md text-sm text-on-surface font-semibold tracking-tight truncate">
            Elena Rossi
          </span>
          <span className="font-label-sm text-[10px] text-secondary uppercase tracking-widest truncate">
            Interior Architect
          </span>
        </div>
      </div>

      <ul className="flex flex-col space-y-1 grow">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-label-sm text-xs uppercase tracking-wider transition-colors ${
                  active
                    ? 'text-primary bg-[#FBF9F4] font-semibold shadow-sm border border-[#EAE8E3]'
                    : 'text-secondary hover:bg-[#EAE8E3]'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
