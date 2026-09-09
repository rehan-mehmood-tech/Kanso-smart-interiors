import React from 'react';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { GlobalLeadFeed } from '@/components/admin/GlobalLeadFeed';
import { getBusinesses, getLeads } from '@/lib/admin/actions';
import type { AdminLeadFilter } from '@/lib/admin/types';

export const metadata: Metadata = {
  title: 'Global Lead Feed — Kanso Admin',
  description: 'Every consultation lead across the platform.',
};

const VALID: AdminLeadFilter[] = ['all', 'unassigned', 'assigned', 'completed'];

interface PageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const { filter } = await searchParams;
  const [leads, businesses] = await Promise.all([getLeads(), getBusinesses()]);
  const businessNames = Object.fromEntries(businesses.map((b) => [b.id, b.name]));
  const initial = VALID.includes(filter as AdminLeadFilter)
    ? (filter as AdminLeadFilter)
    : 'all';

  return (
    <>
      <AdminPageHeader
        eyebrow="Lead Flow"
        title="Global Lead Feed"
        description="Every consultation request across all businesses. Unassigned leads are reaching no vendor and need routing."
      />
      <GlobalLeadFeed leads={leads} businessNames={businessNames} initialFilter={initial} />
    </>
  );
}
