import React from 'react';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { UsersDirectory } from '@/components/admin/UsersDirectory';
import { getUsers } from '@/lib/admin/actions';

export const metadata: Metadata = {
  title: 'Users Directory — Kanso Admin',
  description: 'Every registered account, with role and status.',
};

export default async function AdminUsersPage() {
  const users = await getUsers();
  return (
    <>
      <AdminPageHeader
        eyebrow="Accounts"
        title="Users Directory"
        description="Every registered account across the platform. Search filters by name or email as you type."
      />
      <UsersDirectory users={users} />
    </>
  );
}
