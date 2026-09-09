import React from 'react';
import { ProHeader } from '@/components/pro/dashboard/ProHeader';
import { ProStatsOverview } from '@/components/pro/dashboard/ProStatsOverview';
import { LeadTable } from '@/components/pro/dashboard/LeadTable';
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ProSidebar } from '@/components/pro/layout/ProSidebar';
import { getVendorAccess } from '@/lib/pro/access';
import { getVendorLeads } from '@/lib/pro/mock-leads';

interface ProDashboardPageProps {
  searchParams: Promise<{ access?: string }>;
}

export default async function ProDashboardPage({ searchParams }: ProDashboardPageProps) {
  const { access } = await searchParams;
  const vendorAccess = await getVendorAccess(access);
  const leads = getVendorLeads(vendorAccess.hasPaidAccess);

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1B1C19] font-body-md">
      <SiteHeader position="fixed" />
      <div className="flex pt-16">
      <ProSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full lg:ml-64 min-h-screen relative">
        <div className="p-4 md:p-8 lg:p-12 flex-1 flex flex-col max-w-[1400px] mx-auto w-full">
          <ProHeader />
          <ProStatsOverview />
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 flex-1 items-start">
            {/* Left Col (Takes up more space) */}
            <div className="xl:col-span-2 flex flex-col">
              <LeadTable leads={leads} />
            </div>

            {/* Right Col (Schedule) */}
            <div className="flex flex-col gap-6 md:gap-8 sticky top-8">
              <div className="bg-surface-container-lowest p-6 md:p-8 rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-surface-container flex-1">
                <h2 className="font-display-xl text-2xl md:text-[28px] tracking-tight text-on-surface mb-6">Today's Schedule</h2>
                <div className="flex flex-col gap-4 mt-6">
                  
                  <div className="flex gap-4">
                    <div className="w-16 text-right shrink-0 mt-1">
                      <span className="font-label-sm text-xs text-secondary">10:00 AM</span>
                    </div>
                    <div className="flex-1 border-l-2 border-outline-variant pl-4 pb-6">
                      <div className="font-body-md text-base text-on-surface font-semibold tracking-tight">Initial Consultation</div>
                      <div className="font-label-sm text-xs text-secondary mt-1">Sarah Jenkins - Video Call</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-16 text-right shrink-0 mt-1">
                      <span className="font-label-sm text-xs text-secondary">1:30 PM</span>
                    </div>
                    <div className="flex-1 border-l-2 border-primary pl-4 pb-6 relative">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-primary"></div>
                      <div className="font-body-md text-base text-on-surface font-semibold tracking-tight">Material Review</div>
                      <div className="font-label-sm text-xs text-secondary mt-1">Studio Downtown</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </div>
  );
}
