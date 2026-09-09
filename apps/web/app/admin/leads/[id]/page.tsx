import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Phone, Mail, MapPin, Building2, CalendarDays } from 'lucide-react';
import { StatusPill } from '@/components/admin/StatusPill';
import { LeadAssignmentPanel } from '@/components/admin/LeadAssignmentPanel';
import { assignLead, getBusinesses, getLead } from '@/lib/admin/actions';
import { getUniqueAsset, getRoomWallSet } from '@/lib/constants/assets';
import { TRADE_LABELS } from '@/lib/admin/types';

export const metadata: Metadata = {
  title: 'Lead Detail — Kanso Admin',
  description: 'Full lead record with assignment override.',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminLeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [lead, businesses] = await Promise.all([getLead(id), getBusinesses()]);
  if (!lead) notFound();

  const assigned = businesses.find((b) => b.id === lead.businessId) ?? null;
  const wallPhotos = getRoomWallSet(lead.id);
  const conceptImage = getUniqueAsset('concepts', lead.id);

  return (
    <>
      <Link
        href="/admin/leads"
        className="mb-6 inline-flex items-center gap-2 font-label-sm text-xs tracking-widest text-[#1b1c19]/55 uppercase transition-colors hover:text-[#1b1c19]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Global Lead Feed
      </Link>

      <header className="mb-8 flex flex-col gap-3 border-b border-[#c4c7c7] pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display-xl text-3xl tracking-tight text-[#1b1c19] md:text-4xl">
            {lead.customerName}
          </h1>
          <StatusPill
            label={lead.status}
            tone={lead.status === 'new' ? 'warning' : lead.status === 'completed' ? 'positive' : 'neutral'}
          />
          {!lead.businessId && <StatusPill label="Unassigned" tone="critical" />}
        </div>
        <p className="font-body text-sm text-[#1b1c19]/65">
          {lead.roomType} &middot; {lead.styleSlug.replace(/_/g, ' ')} &middot; {lead.city}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-8 lg:col-span-8">
          <section className="overflow-hidden rounded-xl border border-[#c4c7c7] bg-[#fbf9f4]">
            <div className="relative aspect-video w-full bg-[#f4f0ea]">
              <Image
                src={conceptImage}
                alt={`Selected concept for ${lead.customerName}`}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="p-5">
              <h2 className="font-serif text-lg leading-tight text-[#1b1c19]">Selected Concept</h2>
              <p className="mt-1.5 font-body text-sm text-[#1b1c19]/60">
                {lead.styleSlug.replace(/_/g, ' ')} &middot; {lead.roomType}
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-lg leading-tight text-[#1b1c19]">
              Original Room Photos
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {wallPhotos.map((url, i) => (
                <figure
                  key={url}
                  className="overflow-hidden rounded-lg border border-[#c4c7c7] bg-[#f4f0ea]"
                >
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={url}
                      alt={`Wall ${i + 1} capture`}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="px-3 py-2 font-label-sm text-[10px] tracking-widest text-[#1b1c19]/50 uppercase">
                    Wall {i + 1} of 4
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4">
          <section className="rounded-xl border border-[#c4c7c7] bg-[#fbf9f4] p-6">
            <h2 className="font-serif text-lg leading-tight text-[#1b1c19]">Customer</h2>
            <dl className="mt-5 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#1b1c19]/55" />
                <dd className="font-body text-sm text-[#1b1c19]">{lead.customerPhone}</dd>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#1b1c19]/55" />
                <dd className="min-w-0 truncate font-body text-sm text-[#1b1c19]">
                  {lead.customerEmail}
                </dd>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-[#1b1c19]/55" />
                <dd className="font-body text-sm text-[#1b1c19]">{lead.city}</dd>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 shrink-0 text-[#1b1c19]/55" />
                <dd className="font-body text-sm text-[#1b1c19] tabular-nums">
                  {new Date(lead.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </dd>
              </div>
            </dl>
            <p className="mt-5 border-t border-[#c4c7c7] pt-4 font-body text-xs leading-relaxed text-[#1b1c19]/45">
              Admins see full contact details regardless of any vendor paywall.
            </p>
          </section>

          {assigned && (
            <section className="rounded-xl border border-[#c4c7c7] bg-[#fbf9f4] p-6">
              <h2 className="font-serif text-lg leading-tight text-[#1b1c19]">Assigned Business</h2>
              <div className="mt-4 flex items-start gap-3">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1b1c19]/55" />
                <div className="min-w-0">
                  <p className="font-body-md text-sm font-medium text-[#1b1c19]">{assigned.name}</p>
                  <p className="mt-1 font-body text-xs text-[#1b1c19]/60">
                    {TRADE_LABELS[assigned.trade]} &middot; {assigned.location}
                  </p>
                  <p className="mt-1 font-body text-xs text-[#1b1c19]/60">{assigned.phone}</p>
                </div>
              </div>
            </section>
          )}

          <LeadAssignmentPanel lead={lead} businesses={businesses} assignAction={assignLead} />
        </div>
      </div>
    </>
  );
}
