"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { StatusPill } from './StatusPill';
import { getUniqueAsset } from '@/lib/constants/assets';
import type { AdminLead, AdminLeadFilter } from '@/lib/admin/types';

interface GlobalLeadFeedProps {
  leads: AdminLead[];
  businessNames: Record<string, string>;
  initialFilter?: AdminLeadFilter;
}

const FILTERS: { value: AdminLeadFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unassigned', label: 'Unassigned' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'completed', label: 'Completed' },
];

function matchesFilter(lead: AdminLead, filter: AdminLeadFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'unassigned') return lead.businessId === null;
  if (filter === 'assigned') return lead.businessId !== null && lead.status !== 'completed';
  return lead.status === 'completed';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function GlobalLeadFeed({
  leads,
  businessNames,
  initialFilter = 'all',
}: GlobalLeadFeedProps) {
  const [filter, setFilter] = useState<AdminLeadFilter>(initialFilter);
  const [query, setQuery] = useState('');

  const counts = useMemo<Record<AdminLeadFilter, number>>(
    () => ({
      all: leads.length,
      unassigned: leads.filter((l) => matchesFilter(l, 'unassigned')).length,
      assigned: leads.filter((l) => matchesFilter(l, 'assigned')).length,
      completed: leads.filter((l) => matchesFilter(l, 'completed')).length,
    }),
    [leads],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesQuery =
        !q ||
        lead.customerName.toLowerCase().includes(q) ||
        lead.city.toLowerCase().includes(q) ||
        lead.roomType.toLowerCase().includes(q) ||
        (businessNames[lead.businessId ?? ''] ?? '').toLowerCase().includes(q);
      return matchesQuery && matchesFilter(lead, filter);
    });
  }, [leads, query, filter, businessNames]);

  return (
    <div className="flex flex-col gap-5">
      <div className="relative w-full lg:max-w-[24rem]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-[#1b1c19]/45" />
        </div>
        <label htmlFor="lead-search" className="sr-only">
          Search leads
        </label>
        <input
          id="lead-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Customer, city, room or vendor"
          className="block min-h-[44px] w-full rounded-2xl border border-[#c4c7c7] bg-[#f4f0ea] py-2 pr-3 pl-10 font-body text-sm text-[#1b1c19] outline-none transition-colors placeholder:text-[#1b1c19]/40 focus:border-[#1b1c19] focus:ring-1 focus:ring-[#1b1c19]"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter leads">
        {FILTERS.map(({ value, label }) => {
          const active = filter === value;
          return (
            <button
              key={value}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(value)}
              className={`min-h-[36px] rounded-full border px-4 py-1.5 font-body text-xs whitespace-nowrap transition-colors duration-200 ${
                active
                  ? 'border-[#1b1c19] bg-[#1b1c19] text-[#fbf9f4]'
                  : 'border-[#c4c7c7] bg-[#fbf9f4] text-[#1b1c19]/70 hover:border-[#1b1c19] hover:text-[#1b1c19]'
              }`}
            >
              {label}
              <span className={active ? 'ml-2 opacity-70' : 'ml-2 opacity-55'}>
                {counts[value]}
              </span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#c4c7c7] bg-[#f4f0ea] px-6 py-16 text-center">
          <p className="font-serif text-lg text-[#1b1c19]">No leads match this view</p>
          <p className="mt-2 font-body text-sm text-[#1b1c19]/60">
            Try another filter, or clear the search.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {visible.map((lead) => {
            const vendor = lead.businessId ? businessNames[lead.businessId] : null;
            return (
              <li key={lead.id}>
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="group flex gap-4 rounded-xl border border-[#c4c7c7] bg-[#fbf9f4] p-4 transition-colors hover:border-[#1b1c19]"
                >
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-[#c4c7c7]">
                    <Image
                      src={getUniqueAsset('concepts', lead.id)}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-body-md text-sm font-semibold text-[#1b1c19]">
                        {lead.customerName}
                      </span>
                      <StatusPill
                        label={lead.status}
                        tone={
                          lead.status === 'new'
                            ? 'warning'
                            : lead.status === 'completed'
                              ? 'positive'
                              : 'neutral'
                        }
                      />
                    </div>

                    <span className="flex items-center gap-1.5 font-body text-xs text-[#1b1c19]/60">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {lead.roomType} &middot; {lead.city}
                      </span>
                    </span>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                      {vendor ? (
                        <span className="truncate font-body text-xs text-[#1b1c19]/70">
                          Assigned to {vendor}
                        </span>
                      ) : (
                        <StatusPill label="Unassigned" tone="critical" />
                      )}
                      <span className="flex shrink-0 items-center gap-1 font-label-sm text-[10px] tracking-wider text-[#1b1c19]/45 uppercase tabular-nums">
                        {formatDate(lead.createdAt)}
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
