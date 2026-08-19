import React from 'react';
import Image from 'next/image';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  isFeatured?: boolean;
}

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const featured = items.find(i => i.isFeatured) || items[0];
  const others = items.filter(i => i.id !== featured.id);

  return (
    <div className="mb-12">
      <div className="flex justify-between items-end mb-6">
        <h2 className="font-display-xl text-2xl text-primary tracking-tight">Selected Works</h2>
        <span className="font-label-sm text-[10px] text-secondary uppercase tracking-widest hidden sm:block">Architecture & Interiors</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Large Feature Image */}
        {featured && (
          <div className="md:col-span-2 relative aspect-[4/3] rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant/30 group cursor-pointer bg-[#F4F2ED]">
            <Image 
              src={featured.imageUrl} 
              alt={featured.title} 
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 md:p-8">
              <div>
                <span className="font-body-md text-lg text-white font-medium block mb-1">{featured.title}</span>
                <span className="font-label-sm text-[10px] uppercase tracking-widest text-white/80">{featured.category}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Stacked Smaller Images */}
        <div className="flex flex-col gap-4 md:gap-6">
          {others.slice(0, 2).map(item => (
            <div key={item.id} className="relative flex-1 aspect-square md:aspect-auto rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant/30 group cursor-pointer bg-[#F4F2ED]">
              <Image 
                src={item.imageUrl} 
                alt={item.title} 
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 md:p-6">
                <div>
                  <span className="font-body-md text-sm text-white font-medium block mb-1">{item.title}</span>
                  <span className="font-label-sm text-[10px] uppercase tracking-widest text-white/80">{item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
