import React from 'react';

interface AdminPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function AdminPageHeader({ eyebrow, title, description, children }: AdminPageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-[#c4c7c7] pb-8">
      <span className="font-body text-xs tracking-[0.2em] text-[#1b1c19]/45 uppercase">
        {eyebrow}
      </span>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display-xl text-3xl tracking-tight text-[#1b1c19] md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-[46rem] font-body text-sm leading-relaxed text-[#1b1c19]/65 sm:text-base">
            {description}
          </p>
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </header>
  );
}
