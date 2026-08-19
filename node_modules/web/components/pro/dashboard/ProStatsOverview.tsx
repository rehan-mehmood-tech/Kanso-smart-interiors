import React from 'react';
import { UserPlus, Clock, DollarSign } from 'lucide-react'; 

export function ProStatsOverview() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
      {/* Metric Card 1 */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col justify-between min-h-[160px]">
        <div className="flex justify-between items-start mb-2">
          <span className="font-body-md text-sm text-secondary font-medium">New Leads</span>
          <UserPlus className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="font-display-xl text-[48px] leading-none tracking-tight text-on-surface">12</div>
          <div className="font-label-sm text-xs text-secondary mt-4 flex items-center gap-1 uppercase tracking-wider">
            <span className="text-green-700 font-bold">+3</span> since last week
          </div>
        </div>
      </div>
      
      {/* Metric Card 2 */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col justify-between min-h-[160px]">
        <div className="flex justify-between items-start mb-2">
          <span className="font-body-md text-sm text-secondary font-medium">Active Projects</span>
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="font-display-xl text-[48px] leading-none tracking-tight text-on-surface">8</div>
          <div className="font-label-sm text-xs text-secondary mt-4 flex items-center gap-1 uppercase tracking-wider">
            <span className="text-yellow-700 font-bold">2 pending</span> review
          </div>
        </div>
      </div>
      
      {/* Metric Card 3 */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-surface-container flex flex-col justify-between min-h-[160px]">
        <div className="flex justify-between items-start mb-2">
          <span className="font-body-md text-sm text-secondary font-medium">Est. Earnings</span>
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="font-display-xl text-[48px] leading-none tracking-tight text-on-surface">$24.5k</div>
          <div className="font-label-sm text-xs text-secondary mt-4 flex items-center gap-1 uppercase tracking-wider">
            <span className="text-green-700 font-bold">On track</span> for Q3
          </div>
        </div>
      </div>
    </section>
  );
}
