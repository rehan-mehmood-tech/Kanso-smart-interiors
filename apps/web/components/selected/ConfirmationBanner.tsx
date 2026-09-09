import React from 'react';
import Image from 'next/image';

interface ConfirmationBannerProps {
  imageUrl: string;
  /** The customer's room type, so the heading names their actual space. */
  roomLabel?: string;
}

export function ConfirmationBanner({ imageUrl, roomLabel }: ConfirmationBannerProps) {
  return (
    <section className="mb-12">
      <div className="mb-8 text-center md:text-left pt-6">
        <h1 className="font-display-xl text-primary text-4xl md:text-5xl mb-4 leading-tight">
          {roomLabel ? `Your ${roomLabel} is Locked` : 'Your Curated Space is Locked'}
        </h1>
        <p className="text-body-lg font-body-lg text-secondary max-w-2xl">
          We&rsquo;ve secured your chosen concept. Below is your detailed design specification, ready to bring this vision to life.
        </p>
      </div>
      <div className="w-full aspect-[16/9] md:aspect-[2/1] rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-outline-variant relative">
        <Image 
          src={imageUrl} 
          alt={roomLabel ? `Your selected ${roomLabel.toLowerCase()} concept` : 'Selected design concept'}
          
          fill
          priority={true}
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
