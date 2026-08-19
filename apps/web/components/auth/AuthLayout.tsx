import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: React.ReactNode;
  imageUrl?: string;
}

export function AuthLayout({ 
  children,
  title,
  description,
  imageUrl = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85"
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen w-full flex-col lg:flex-row bg-background text-on-background selection:bg-secondary-fixed selection:text-on-secondary-fixed overflow-x-hidden">
      {/* Left Hemisphere: Imagery Canvas */}
      <section className="hidden lg:flex lg:w-1/2 relative bg-surface-container-lowest overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src={imageUrl} 
            alt="Architectural Interior" 
            fill 
            priority 
            sizes="(max-width: 1024px) 100vw, 50vw" 
            className="object-cover object-center transition-transform duration-[20s] ease-out hover:scale-105" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
        <div className="absolute top-12 left-12 z-10">
          <Link href="/" className="font-display-xl text-headline-md tracking-tighter text-on-primary drop-shadow-md hover:opacity-80 transition-opacity">
            Kanso
          </Link>
        </div>
      </section>

      {/* Right Hemisphere: Authentication Form */}
      <section className="flex-1 flex flex-col justify-center items-center px-4 py-12 lg:px-24 lg:py-24 bg-surface relative">
        {/* Mobile Branding Header */}
        <div className="absolute top-8 left-4 lg:hidden">
          <Link href="/" className="font-display-xl text-headline-md tracking-tighter text-primary">
            Kanso
          </Link>
        </div>
        
        <div className="w-full max-w-[420px] mx-auto space-y-12">
          {/* Intent Header */}
          <div className="space-y-2 text-center lg:text-left animate-in fade-in slide-in-from-bottom-2 duration-1000">
            <h1 className="font-headline-lg-mobile lg:font-headline-lg text-3xl lg:text-4xl text-primary">
              {title}
            </h1>
            <p className="font-body-md text-secondary">
              {description}
            </p>
          </div>
          
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 fill-mode-both">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
