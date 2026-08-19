import React, { ReactNode } from 'react';

interface GeneratingLayoutProps {
  children: ReactNode;
  bgEmptyUrl: string;
  bgFinishedUrl: string;
  progress: number; // 0 to 100, determines the opacity of the crossfade
}

export function GeneratingLayout({ children, bgEmptyUrl, bgFinishedUrl, progress }: GeneratingLayoutProps) {
  // progress 0 = empty is 100% visible
  // progress 100 = finished is 100% visible
  const emptyOpacity = 1 - (progress / 100) * 0.7; // fade to 0.3
  const finishedOpacity = (progress / 100) * 0.7; // fade to 0.7

  return (
    <div className="relative w-full h-screen overflow-hidden bg-surface text-on-surface antialiased">
      {/* Background Images Crossfade */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-[100ms] ease-linear"
        style={{ backgroundImage: `url('${bgEmptyUrl}')`, opacity: emptyOpacity }}
      />
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-[100ms] ease-linear"
        style={{ backgroundImage: `url('${bgFinishedUrl}')`, opacity: finishedOpacity }}
      />
      
      {/* Overlay Content */}
      <div className="absolute inset-0 bg-surface/80 backdrop-blur-md flex flex-col justify-center items-center px-6 text-center">
        {children}
      </div>
    </div>
  );
}
