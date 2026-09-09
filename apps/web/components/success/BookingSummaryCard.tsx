import React from 'react';
import { Clock, Store } from 'lucide-react';

export interface BookingSuccessSummary {
  projectId: string;
  roomType: string;
  style: string;
  location: string;
  partnerName: string;
  partnerRole: string;
  /** False while the lead is queued for manual matching. */
  hasPartner: boolean;
  /** The backend's own words about what happens next. */
  message: string | null;
}

interface BookingSummaryCardProps {
  summary: BookingSuccessSummary;
}

export function BookingSummaryCard({ summary }: BookingSummaryCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant p-6 md:p-8 mb-10 animate-[fade-in-up_0.6s_ease-out_0.3s_forwards] opacity-0 w-full text-left">
      <h3 className="font-label-sm text-xs text-secondary uppercase tracking-widest mb-6 border-b border-outline-variant/50 pb-4">
        Request Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <p className="font-label-sm text-[10px] text-secondary mb-1 uppercase tracking-wider">Project Ref</p>
            <p className="font-body-md text-primary font-medium">{summary.projectId.toUpperCase()}</p>
          </div>
          <div>
            <p className="font-label-sm text-[10px] text-secondary mb-1 uppercase tracking-wider">Room & Style</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-body-md text-primary font-medium">{summary.roomType}</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span className="font-body-md text-secondary">{summary.style}</span>
            </div>
          </div>
          <div>
            <p className="font-label-sm text-[10px] text-secondary mb-1 uppercase tracking-wider">Location</p>
            <p className="font-body-md text-primary font-medium">{summary.location}</p>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-6 border border-surface-container flex flex-col sm:flex-row items-center sm:items-start gap-4 h-fit text-center sm:text-left">
          {/* A mark, not a photograph. The assigned partner is a real local
              business and we have no portrait of them; a stock avatar here
              would be presenting a stranger's face as the person coming. */}
          <div className="w-16 h-16 rounded-full bg-surface-variant shrink-0 border border-outline-variant/30 shadow-sm flex items-center justify-center">
            {summary.hasPartner ? (
              <Store className="w-7 h-7 text-secondary" />
            ) : (
              <Clock className="w-7 h-7 text-secondary" />
            )}
          </div>
          <div>
            <p className="font-label-sm text-[10px] text-secondary uppercase tracking-widest mb-1 mt-2 sm:mt-0">
              {summary.hasPartner ? 'Assigned Partner' : 'Matching In Progress'}
            </p>
            <p className="font-body-md text-primary font-semibold">{summary.partnerName}</p>
            <p className="font-body-md text-sm text-secondary mt-0.5">{summary.partnerRole}</p>
          </div>
        </div>
      </div>

      {summary.message && (
        <p className="font-body-md text-sm text-secondary mt-6 pt-4 border-t border-outline-variant/50">
          {summary.message}
        </p>
      )}
    </div>
  );
}
