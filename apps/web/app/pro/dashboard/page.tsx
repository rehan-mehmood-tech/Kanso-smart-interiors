import React from 'react';
import Image from 'next/image';
import { ProHeader } from '@/components/pro/dashboard/ProHeader';
import { ProStatsOverview } from '@/components/pro/dashboard/ProStatsOverview';
import { LeadTable } from '@/components/pro/dashboard/LeadTable';
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function ProDashboardPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1B1C19] font-body-md">
      <SiteHeader position="fixed" />
      <div className="flex pt-16">
      {/* Static SideNavBar (Desktop) */}
      <nav className="hidden lg:flex flex-col h-[calc(100vh-4rem)] p-4 space-y-4 fixed left-0 top-16 w-64 bg-[#F0EEE9] border-r border-[#EAE8E3] shrink-0 z-20">
        <div className="flex items-center gap-2 mb-4 px-2 pt-2">
          <span className="font-body text-xs font-semibold tracking-[0.18em] text-[#1b1c19]/55 uppercase">Partner Workspace</span>
        </div>
        
        <div className="flex items-center gap-4 px-2 py-4 border-b border-[#EAE8E3] mb-4">
          <div className="relative w-10 h-10 rounded-full bg-[#E4E2DD] overflow-hidden shrink-0 flex items-center justify-center font-display-xl text-lg border border-[#C4C7C7]">
            <Image 
              src="/assets/images/rooms/interior-wide-1.jpg" 
              alt="Elena Rossi" 
              fill
              sizes="40px"
              className="object-cover" 
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-body-md text-sm text-on-surface font-semibold tracking-tight truncate">Elena Rossi</span>
            <span className="font-label-sm text-[10px] text-secondary uppercase tracking-widest truncate">Interior Architect</span>
          </div>
        </div>
        
        <button className="w-full py-3 px-4 bg-primary text-on-primary font-label-sm text-xs tracking-wider uppercase rounded-lg mb-4 hover:bg-surface-tint transition-colors shadow-sm">
          New Project
        </button>
        
        <ul className="flex flex-col space-y-1 flex-grow">
          <li>
            <a href="/pro/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-primary bg-[#FBF9F4] font-label-sm text-xs uppercase tracking-wider font-semibold shadow-sm border border-[#EAE8E3]">
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-secondary font-label-sm text-xs uppercase tracking-wider hover:bg-[#EAE8E3] transition-colors">
              <span className="material-symbols-outlined text-[20px]">architecture</span>
              Projects
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-secondary font-label-sm text-xs uppercase tracking-wider hover:bg-[#EAE8E3] transition-colors">
              <span className="material-symbols-outlined text-[20px]">group</span>
              Clients
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-secondary font-label-sm text-xs uppercase tracking-wider hover:bg-[#EAE8E3] transition-colors">
              <span className="material-symbols-outlined text-[20px]">settings</span>
              Settings
            </a>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full lg:ml-64 min-h-screen relative">
        <div className="p-4 md:p-8 lg:p-12 flex-1 flex flex-col max-w-[1400px] mx-auto w-full">
          <ProHeader />
          <ProStatsOverview />
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 flex-1 items-start">
            {/* Left Col (Takes up more space) */}
            <div className="xl:col-span-2 flex flex-col">
              <LeadTable />
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
