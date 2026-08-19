import React from 'react';
import { Inbox } from 'lucide-react';

export function EmptyLeadState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-[#F4F2ED] rounded-full flex items-center justify-center mb-4 border border-outline-variant/30">
        <Inbox className="w-6 h-6 text-secondary" />
      </div>
      <h3 className="font-body-md text-primary font-medium mb-1">No Leads Found</h3>
      <p className="font-body-md text-secondary text-sm">There are no leads matching your current filters.</p>
    </div>
  );
}
