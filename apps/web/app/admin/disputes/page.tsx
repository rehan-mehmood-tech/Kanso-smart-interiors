import React from 'react';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DisputeInbox } from '@/components/admin/DisputeInbox';
import {
  banBusiness,
  getBusinesses,
  getComplaints,
  getModerationLog,
  setComplaintStatus,
} from '@/lib/admin/actions';

export const metadata: Metadata = {
  title: 'Moderation & Disputes — Kanso Admin',
  description: 'Customer complaints against vendors, and moderation actions.',
};

export default async function AdminDisputesPage() {
  const [complaints, businesses, moderationLog] = await Promise.all([
    getComplaints(),
    getBusinesses(),
    getModerationLog(),
  ]);

  return (
    <>
      <AdminPageHeader
        eyebrow="Moderation"
        title="Complaints & Disputes"
        description="Reports submitted by customers against vendors. Banning a vendor cancels their subscription, revokes lead access and archives their catalogue in one action."
      />
      <DisputeInbox
        complaints={complaints}
        businesses={businesses}
        moderationLog={moderationLog}
        banAction={banBusiness}
        setStatusAction={setComplaintStatus}
      />
    </>
  );
}
