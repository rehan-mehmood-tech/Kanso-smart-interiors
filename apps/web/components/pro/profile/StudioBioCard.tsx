import React from 'react';

export interface StudioBio {
  about: string;
  experienceYears: number;
  tags: string[];
}

export function StudioBioCard({ bio }: { bio: StudioBio }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] mb-8">
      <h3 className="font-display-xl text-xl text-primary tracking-tight mb-4">Studio Philosophy</h3>
      <div className="prose prose-p:font-body-md prose-p:text-sm text-secondary max-w-none leading-relaxed mb-6">
        <p>{bio.about}</p>
      </div>
      
      <div className="pt-6 border-t border-outline-variant/30">
        <h4 className="font-label-sm text-[10px] uppercase tracking-widest text-secondary mb-4">Specialization</h4>
        <div className="flex flex-wrap gap-2">
          {bio.tags.map(tag => (
            <span key={tag} className="px-3 py-1.5 bg-[#F4F2ED] border border-outline-variant/30 rounded font-label-sm text-[10px] text-primary uppercase tracking-widest">
              {tag}
            </span>
          ))}
          <span className="px-3 py-1.5 bg-primary/5 border border-primary/20 rounded font-label-sm text-[10px] text-primary uppercase tracking-widest font-bold">
            {bio.experienceYears}+ Years Experience
          </span>
        </div>
      </div>
    </div>
  );
}
