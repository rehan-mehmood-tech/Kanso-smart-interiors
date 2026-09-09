import React from 'react';
import { LeadDetailHeader } from '@/components/pro/leads/LeadDetailHeader';
import { CustomerContactCard } from '@/components/pro/leads/CustomerContactCard';
import { SelectedConceptViewer } from '@/components/pro/leads/SelectedConceptViewer';
import { WallCaptureGallery } from '@/components/pro/leads/WallCaptureGallery';
import { MaterialSpecAccordion } from '@/components/pro/leads/MaterialSpecAccordion';
import { ProNotesForm } from '@/components/pro/leads/ProNotesForm';
import { SiteHeader } from "@/components/layout/SiteHeader";

// Mock Data
const MOCK_LEAD = {
  id: 'lead-1',
  name: 'Sarah Jenkins',
  roomType: 'Living Room & Kitchen',
  style: 'Warm Minimalist',
  contact: {
    name: 'Sarah Jenkins',
    phone: '+92 300 1234567',
    email: 'sarah.jenkins@example.com',
    location: 'Gulberg III, Lahore',
    schedule: 'Preferred: Mornings (9am - 12pm)',
    notes: 'Access via service elevator. Please bring physical samples for the oak flooring if possible.'
  },
  conceptImage: '/assets/images/rooms/interior-wide-1.jpg',
  wallPhotos: [
    { id: 'w1', label: 'Wall A (Front)', url: '/assets/images/rooms/interior-wide-1.jpg' },
    { id: 'w2', label: 'Wall B (Right)', url: '/assets/images/rooms/interior-wide-1.jpg' },
    { id: 'w3', label: 'Wall C (Back)', url: '/assets/images/rooms/interior-wide-1.jpg' },
    { id: 'w4', label: 'Wall D (Left)', url: '/assets/images/rooms/interior-wide-1.jpg' }
  ],
  specs: [
    {
      category: 'Color Palette & Lighting',
      items: [
        'Warm Bone White (#FBF9F4) base walls',
        'Matte Charcoal (#1B1C19) accent framing',
        'Diffused perimeter cove lighting (3000K)',
        'Directional spotlighting on key architectural features'
      ]
    },
    {
      category: 'Key Furniture & Materials',
      items: [
        'Low-profile modular sofa in textured Linen Bouclé',
        'Monolithic coffee table in Honed Travertine',
        'Fluted White Oak built-in joinery',
        'Matte Black steel window mullions'
      ]
    },
    {
      category: 'Estimated Scope & Footprint',
      items: [
        'Room Footprint: Approx. 450 sq. ft.',
        'Sourcing Timeline: 6-8 weeks for bespoke items',
        'Contractor Requirement: Light structural (paint & lighting)',
        'Project Tier: Full Furnishing'
      ]
    }
  ]
};

interface ProLeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProLeadDetailPage({ params }: ProLeadDetailPageProps) {
  const { id } = await params;

  // In a real app, fetch data based on `id`. Using mock for now.
  const lead = MOCK_LEAD;

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1B1C19] font-body-md flex flex-col relative overflow-hidden">
      
      {/* Top Navbar */}
      <SiteHeader position="fixed" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
        <LeadDetailHeader 
          leadId={id} 
          leadName={lead.name} 
          roomType={lead.roomType} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
            <SelectedConceptViewer 
              imageUrl={lead.conceptImage} 
              style={lead.style} 
              roomType={lead.roomType} 
            />
            <WallCaptureGallery photos={lead.wallPhotos} />
            <MaterialSpecAccordion specs={lead.specs} />
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8 sticky top-28">
            <CustomerContactCard info={lead.contact} />
            <ProNotesForm />
          </div>
        </div>
      </main>
    </div>
  );
}