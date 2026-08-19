import React from 'react';
import Link from 'next/link';
import { Video, MapPin, ArrowRight } from 'lucide-react';

export interface Appointment {
  id: string;
  leadId: string;
  clientName: string;
  projectType: string;
  time: string;
  date: string;
  format: 'Virtual' | 'On-site';
}

export function UpcomingAppointmentsSidebar({ appointments }: { appointments: Appointment[] }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/30">
        <h2 className="font-display-xl text-xl text-primary tracking-tight">Upcoming Consultations</h2>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {appointments.map((apt) => (
          <div key={apt.id} className="group flex flex-col gap-3 p-4 bg-[#FBF9F4] rounded-lg border border-outline-variant/30 hover:border-outline-variant/60 transition-all shadow-sm">
            
            <div className="flex justify-between items-start">
              <div>
                <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary block mb-1">{apt.date} • {apt.time}</span>
                <h3 className="font-body-md text-base text-primary font-semibold tracking-tight">{apt.clientName}</h3>
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded font-label-sm text-[10px] uppercase tracking-widest ${apt.format === 'Virtual' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-purple-50 text-purple-700 border border-purple-100'}`}>
                {apt.format === 'Virtual' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                {apt.format}
              </div>
            </div>

            <p className="font-body-md text-sm text-secondary">{apt.projectType}</p>

            <div className="pt-3 mt-1 border-t border-outline-variant/20 flex justify-end">
              <Link href={`/pro/leads/${apt.leadId}`} className="inline-flex items-center gap-1 text-primary font-label-sm text-[10px] uppercase tracking-widest group-hover:text-secondary transition-colors">
                View Lead <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
          </div>
        ))}

        {appointments.length === 0 && (
          <div className="flex-1 flex items-center justify-center py-12 text-center">
            <p className="font-body-md text-sm text-secondary">No upcoming consultations this week.</p>
          </div>
        )}
      </div>
    </div>
  );
}
