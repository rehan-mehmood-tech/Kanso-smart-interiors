import React from 'react';
import { Plus } from 'lucide-react';

interface EmptySlotCardProps {
  time: string;
}

export function EmptySlotCard({ time }: EmptySlotCardProps) {
  return (
    <div className="w-full h-full min-h-[80px] bg-[#FBF9F4] border border-dashed border-outline-variant/40 rounded-lg flex items-center justify-center group hover:bg-[#F4F2ED] hover:border-outline-variant transition-all cursor-pointer">
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Plus className="w-3.5 h-3.5 text-secondary" />
        <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary">Block</span>
      </div>
    </div>
  );
}
