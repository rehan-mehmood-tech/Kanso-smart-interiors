import React from 'react';
import { Phone, Mail, MapPin, Calendar, CheckCircle } from 'lucide-react';

export interface CustomerContactInfo {
  name: string;
  phone: string;
  email: string;
  location: string;
  schedule: string;
  notes: string;
}

export function CustomerContactCard({ info }: { info: CustomerContactInfo }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] h-full">
      <div className="flex items-center justify-between mb-6 border-b border-outline-variant/30 pb-4">
        <h2 className="font-display-xl text-xl text-primary tracking-tight">Client Contact</h2>
        <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-200 shadow-sm">
          <CheckCircle className="w-3 h-3" />
          <span className="font-label-sm text-[10px] uppercase tracking-widest">Verified Match</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EAE8E3] border border-outline-variant/30 flex items-center justify-center shrink-0">
            <span className="font-display-xl text-lg text-primary leading-none mt-1">{info.name.charAt(0)}</span>
          </div>
          <span className="font-body-md text-lg text-primary font-medium tracking-tight">{info.name}</span>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3 text-secondary">
              <Phone className="w-4 h-4" />
              <span className="font-body-md text-sm">{info.phone}</span>
            </div>
            <button className="font-label-sm text-[10px] uppercase tracking-widest text-primary border border-outline-variant/50 px-3 py-1.5 rounded hover:bg-[#F4F2ED] transition-colors shadow-sm">
              Call / WA
            </button>
          </div>
          
          <div className="flex items-center gap-3 text-secondary">
            <Mail className="w-4 h-4" />
            <a href={`mailto:${info.email}`} className="font-body-md text-sm hover:text-primary transition-colors underline-offset-4 hover:underline">{info.email}</a>
          </div>

          <div className="flex items-center gap-3 text-secondary">
            <MapPin className="w-4 h-4" />
            <span className="font-body-md text-sm">{info.location}</span>
          </div>
          
          <div className="flex items-center gap-3 text-secondary">
            <Calendar className="w-4 h-4" />
            <span className="font-body-md text-sm text-primary font-medium">{info.schedule}</span>
          </div>
        </div>

        {info.notes && (
          <div className="mt-6 pt-4 border-t border-outline-variant/30">
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary block mb-2">Special Requirements</span>
            <p className="font-body-md text-sm text-primary italic leading-relaxed bg-[#F4F2ED]/50 p-4 rounded-lg border border-outline-variant/20">
              "{info.notes}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
