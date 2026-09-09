"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  Inbox,
  ShieldAlert,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: AdminNavItem[] = [
  { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users Directory', href: '/admin/users', icon: Users },
  { label: 'Business Registry', href: '/admin/businesses', icon: Building2 },
  { label: 'Global Lead Feed', href: '/admin/leads', icon: Inbox },
  { label: 'Moderation', href: '/admin/disputes', icon: ShieldAlert },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin control panel"
      className="hidden lg:flex flex-col h-[calc(100vh-4rem)] p-4 space-y-4 fixed left-0 top-16 w-64 bg-[#F0EEE9] border-r border-[#EAE8E3] shrink-0 z-20"
    >
      <div className="flex items-center gap-2 mb-2 px-2 pt-2">
        <ShieldCheck className="h-4 w-4 shrink-0 text-[#1b1c19]" />
        <span className="font-body text-xs font-semibold tracking-[0.18em] text-[#1b1c19]/55 uppercase">
          Platform Admin
        </span>
      </div>

      <ul className="flex flex-col space-y-1 grow border-t border-[#EAE8E3] pt-4">
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

      <p className="border-t border-[#EAE8E3] pt-4 font-body text-[10px] leading-relaxed text-[#1b1c19]/40">
        Actions here affect live vendor accounts and are written to an audit log.
      </p>
    </nav>
  );
}
