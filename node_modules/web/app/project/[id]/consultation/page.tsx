import React from 'react';
import { ConsultationHeader } from '@/components/consultation/ConsultationHeader';
import { SelectedProjectMiniCard } from '@/components/consultation/SelectedProjectMiniCard';
import { BookingForm } from '@/components/consultation/BookingForm';
import { PrivacyNotice } from '@/components/consultation/PrivacyNotice';
import Link from 'next/link';

const SELECTED_IMAGE = 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85';

interface ConsultationPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConsultationPage({ params }: ConsultationPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-[#F4F2ED]">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 max-w-[1440px] mx-auto bg-[#F4F2ED]/90 backdrop-blur-sm border-b border-outline-variant/30">
        <Link href={`/project/${id}/selected`} className="flex items-center gap-2 cursor-pointer group">
          <span className="material-symbols-outlined text-primary group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-body-md font-body-md text-primary hidden md:inline">Back</span>
        </Link>
        <div className="text-2xl font-bold tracking-tight text-primary cursor-pointer absolute left-1/2 -translate-x-1/2 font-display-xl">
          <Link href="/">Kanso</Link>
        </div>
        <div className="text-sm font-semibold text-primary">
          Consultation
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-[80px] pb-[80px]">
        <section className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 min-h-[calc(100vh-80px-100px)] items-center">
          
          {/* Left Side: Editorial Context & Form */}
          <div className="md:col-span-6 lg:col-span-5 md:col-start-1 lg:col-start-2 flex flex-col justify-center py-12 z-10">
            <ConsultationHeader />
            
            <div className="mt-8">
              <SelectedProjectMiniCard 
                imageUrl={SELECTED_IMAGE} 
                roomType="Living Room" 
                style="Warm Minimalist" 
              />
            </div>

            <BookingForm projectId={id} />
            <PrivacyNotice />
          </div>

          {/* Right Side: Photography Background (Hidden on small mobile, visible on tablet+) */}
          <div className="hidden md:block md:col-span-6 lg:col-span-5 h-[600px] md:h-full min-h-[700px] relative rounded-xl overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
            <div 
              className="bg-cover bg-center w-full h-full absolute inset-0" 
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85')` }}
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1b1b]/20 to-transparent mix-blend-multiply" />
          </div>
          
        </section>
      </main>
    </div>
  );
}