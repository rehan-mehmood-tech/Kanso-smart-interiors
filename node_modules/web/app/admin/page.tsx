"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminMetricsGrid } from '@/components/admin/AdminMetricsGrid';
import { AdminNavigationTabs, AdminTab } from '@/components/admin/AdminNavigationTabs';
import { PartnerStudiosTable } from '@/components/admin/PartnerStudiosTable';
import { OnboardPartnerModal } from '@/components/admin/OnboardPartnerModal';
import { RecentLeadsAuditTable } from '@/components/admin/RecentLeadsAuditTable';
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('Partner Studios');
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#EAE8E3] text-[#1B1C19] font-body-md flex flex-col relative overflow-hidden">
      
      {/* Top Navbar */}
      <SiteHeader position="fixed" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full pt-24 pb-12 px-4 md:px-8 max-w-[1400px] mx-auto">
        
        <AdminHeader />
        <AdminMetricsGrid />
        
        <div className="bg-[#FBF9F4] rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 mb-8">
          <AdminNavigationTabs currentTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="mt-6">
            {activeTab === 'Partner Studios' && (
              <>
                <PartnerStudiosTable onOnboardClick={() => setIsOnboardModalOpen(true)} />
                <RecentLeadsAuditTable />
              </>
            )}
            
            {activeTab === 'All Inquiries / Leads' && (
              <div className="py-12 text-center text-secondary font-body-md">
                All Inquiries view coming soon...
              </div>
            )}
            
            {activeTab === 'User Accounts' && (
              <div className="py-12 text-center text-secondary font-body-md">
                User management view coming soon...
              </div>
            )}
            
            {activeTab === 'System Settings' && (
              <div className="py-12 text-center text-secondary font-body-md">
                Global matching algorithm settings coming soon...
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Modals */}
      <OnboardPartnerModal 
        isOpen={isOnboardModalOpen} 
        onClose={() => setIsOnboardModalOpen(false)} 
      />

    </div>
  );
}
