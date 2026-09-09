import React from 'react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

/**
 * Admin shell.
 *
 * Route access is enforced in proxy.ts before this renders: /admin/* requires
 * a session whose `profiles.role` is `admin`. This layout assumes that check
 * has already passed and only handles presentation.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1B1C19] font-body-md">
      <SiteHeader position="fixed" />
      <div className="flex pt-16">
        <AdminSidebar />
        <main className="flex-1 flex flex-col w-full lg:ml-64 min-h-screen">
          <div className="p-4 md:p-8 lg:p-12 flex-1 flex flex-col max-w-[1400px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
