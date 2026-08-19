import React, { ReactNode } from 'react';

interface MatchingLayoutProps {
  children: ReactNode;
  bgImageUrl: string;
}

export function MatchingLayout({ children, bgImageUrl }: MatchingLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background text-on-background font-body-md overflow-hidden">
      {/* Blurred Background Image Container */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-30" 
          style={{ backgroundImage: `url('${bgImageUrl}')` }}
        />
        {/* Gradient Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </div>

      {/* Main Content Canvas */}
      <main className="relative z-10 flex flex-col items-center w-full px-6 md:px-0 max-w-5xl mx-auto py-24">
        {children}
      </main>
    </div>
  );
}
