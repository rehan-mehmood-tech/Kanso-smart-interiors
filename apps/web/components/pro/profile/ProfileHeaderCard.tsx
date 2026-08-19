import React from 'react';
import Image from 'next/image';
import { CheckCircle, MapPin, Globe, Mail } from 'lucide-react';

export interface SpecialistProfile {
  name: string;
  title: string;
  location: string;
  website: string;
  email: string;
  avatarUrl: string;
  isVerified: boolean;
}

export function ProfileHeaderCard({ profile }: { profile: SpecialistProfile }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start mb-12">
      <div className="w-full md:w-1/3 flex-shrink-0">
        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant/30 bg-[#F4F2ED]">
          <Image 
            alt={profile.name} 
            className="object-cover" 
            src={profile.avatarUrl}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={true}
          />
        </div>
      </div>
      
      <div className="w-full md:w-2/3 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-[32px] md:text-[40px] font-display-xl text-primary leading-tight tracking-tight">{profile.name}</h1>
          {profile.isVerified && (
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200 shadow-sm">
              <CheckCircle className="w-3 h-3" />
              <span className="font-label-sm text-[10px] uppercase tracking-widest">Verified Artisan</span>
            </div>
          )}
        </div>
        
        <p className="font-body-md text-lg text-secondary mb-6">{profile.title}</p>
        
        <div className="flex flex-col gap-3 font-body-md text-sm text-secondary mb-8">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {profile.location}
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" /> <a href={`https://${profile.website}`} className="hover:text-primary transition-colors underline-offset-4 hover:underline">{profile.website}</a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> <a href={`mailto:${profile.email}`} className="hover:text-primary transition-colors underline-offset-4 hover:underline">{profile.email}</a>
          </div>
        </div>

        <button className="self-start bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm text-xs uppercase tracking-widest hover:bg-surface-tint transition-colors shadow-sm">
          Schedule Introductory Call
        </button>
      </div>
    </div>
  );
}
