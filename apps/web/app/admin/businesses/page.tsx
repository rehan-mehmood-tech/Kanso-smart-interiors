import React from 'react';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { BusinessRegistry } from '@/components/admin/BusinessRegistry';
import {
  createBusiness,
  getBusinesses,
  setBusinessDisabled,
  setBusinessVerified,
  updateBusiness,
} from '@/lib/admin/actions';

export const metadata: Metadata = {
  title: 'Business Registry — Kanso Admin',
  description: 'Partner businesses, trades, tiers and verification status.',
};

export default async function AdminBusinessesPage() {
  const businesses = await getBusinesses();

  return (
    <>
      <AdminPageHeader
        eyebrow="Partners"
        title="Business & Partner Registry"
        description="Every registered partner. Disabling is a soft flag, never a delete, so lead history and moderation records survive."
      />
      <BusinessRegistry
        businesses={businesses}
        createAction={createBusiness}
        updateAction={updateBusiness}
        disableAction={setBusinessDisabled}
        verifyAction={setBusinessVerified}
      />
    </>
  );
}
