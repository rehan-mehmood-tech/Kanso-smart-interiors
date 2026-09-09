import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProfileHeaderCard } from '@/components/pro/profile/ProfileHeaderCard';
import { StudioBioCard } from '@/components/pro/profile/StudioBioCard';
import { PortfolioGrid } from '@/components/pro/profile/PortfolioGrid';
import { ServiceTierSpecs } from '@/components/pro/profile/ServiceTierSpecs';
import { ReviewsAndRatingCard } from '@/components/pro/profile/ReviewsAndRatingCard';
import { ProfileEditButton } from '@/components/pro/profile/ProfileEditButton';
import { SiteHeader } from "@/components/layout/SiteHeader";

// Mock Data
const MOCK_PROFILE = {
  name: 'Elena Rossi',
  title: 'Architectural Designer & Spatial Consultant',
  location: 'Milan, IT / Global Remote',
  website: 'rossistudio.co',
  email: 'hello@rossistudio.co',
  avatarUrl: '/assets/images/rooms/interior-wide-2.jpg',
  isVerified: true,
  bio: {
    about: "Elena specializes in crafting environments that embody 'Quiet Luxury'—spaces that speak through material integrity and spatial harmony rather than overt decoration. With over a decade of experience in residential and boutique commercial design, her approach is deeply tactile and intentionally reductive, drawing inspiration from natural light and pure architectural forms.",
    experienceYears: 12,
    tags: ['Quiet Luxury', 'Japandi', 'Minimalist Architecture', 'Bespoke Joinery']
  },
  portfolio: [
    {
      id: 'p1',
      title: 'Villa Lyskamm',
      category: 'Residential Renovation',
      imageUrl: '/assets/images/rooms/interior-wide-4.jpg',
      isFeatured: true
    },
    {
      id: 'p2',
      title: 'Materiality Study',
      category: 'Concept / Detail',
      imageUrl: '/assets/images/rooms/interior-wide-2.jpg'
    },
    {
      id: 'p3',
      title: 'Oak House',
      category: 'Interior Architecture',
      imageUrl: '/assets/images/rooms/interior-wide-2.jpg'
    }
  ],
  services: [
    {
      name: 'Design Consultation',
      leadTime: '1-2 Weeks',
      features: [
        '90-minute video or on-site walkthrough',
        'Spatial planning recommendations',
        'Initial material palette direction',
        'Follow-up summary & next steps'
      ]
    },
    {
      name: 'Concept & Sourcing',
      leadTime: '4-6 Weeks',
      features: [
        'Complete 3D conceptualization',
        'Detailed FF&E sourcing schedule',
        'Physical material sample box',
        'Two rounds of revisions'
      ]
    },
    {
      name: 'Turnkey Execution',
      leadTime: '12+ Weeks',
      features: [
        'End-to-end project management',
        'Contractor bidding & coordination',
        'Custom millwork design & oversight',
        'Final styling and handover'
      ]
    }
  ],
  reviews: {
    average: 4.9,
    total: 34,
    items: [
      {
        id: 'r1',
        author: 'Michael C.',
        rating: 5,
        date: 'Oct 2025',
        text: 'Working with Elena transformed how we experience our home. She has an incredible eye for subtlety and materials. The process was transparent and the result is truly a quiet sanctuary.',
        projectType: 'Turnkey Execution - Master Suite'
      },
      {
        id: 'r2',
        author: 'Sarah J.',
        rating: 5,
        date: 'Aug 2025',
        text: 'The concept package provided everything our contractor needed. Her understanding of Japandi aesthetics is unmatched in the region.',
        projectType: 'Concept & Sourcing - Living Space'
      }
    ]
  }
};

export default function ProProfilePage() {
  const profile = MOCK_PROFILE;

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1B1C19] font-body-md flex flex-col relative overflow-hidden">
      
      {/* Top Navbar */}
      <SiteHeader position="fixed" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full pt-24 pb-24 px-4 md:px-8 max-w-[1000px] mx-auto">
        <Link href="/pro/dashboard" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors font-label-sm text-xs uppercase tracking-widest mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        
        <ProfileHeaderCard profile={profile} />
        <StudioBioCard bio={profile.bio} />
        <PortfolioGrid items={profile.portfolio} />
        <ServiceTierSpecs tiers={profile.services} />
        <ReviewsAndRatingCard reviews={profile.reviews.items} averageRating={profile.reviews.average} totalReviews={profile.reviews.total} />
        
      </main>

      {/* Edit FAB */}
      <ProfileEditButton />
      
    </div>
  );
}
