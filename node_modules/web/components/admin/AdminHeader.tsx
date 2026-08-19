import React from 'react';
import { Search, Activity, ShieldCheck } from 'lucide-react';

export function AdminHeader() {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <h1 className="font-display-xl text-2xl md:text-3xl text-primary tracking-tight leading-none">Platform Admin</h1>
          <span className="px-2.5 py-1 bg-[#F4F2ED] border border-outline-variant/30 rounded text-secondary font-label-sm text-[10px] uppercase tracking-widest hidden sm:inline-block">
            Production MVP 1
          </span>
        </div>
        <p className="font-body-md text-sm text-secondary">Manage specialist partners, monitor AI generations, and audit lead flow.</p>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="hidden lg:flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded border border-green-200 shadow-sm mr-2">
          <Activity className="w-4 h-4" />
          <span className="font-label-sm text-[10px] uppercase tracking-widest">All Systems Operational</span>
        </div>
        
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-secondary" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-outline-variant/50 rounded-lg bg-surface-container-lowest text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors shadow-sm placeholder:text-secondary/70"
            placeholder="Search partners, users, leads..."
          />
        </div>
      </div>
    </header>
  );
}
