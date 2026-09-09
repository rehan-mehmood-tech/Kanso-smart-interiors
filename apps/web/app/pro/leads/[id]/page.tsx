import React from 'react';
import { notFound } from 'next/navigation';
import { LeadDetailHeader } from '@/components/pro/leads/LeadDetailHeader';
import { CustomerContactCard } from '@/components/pro/leads/CustomerContactCard';
import { SelectedConceptViewer } from '@/components/pro/leads/SelectedConceptViewer';
import { WallCaptureGallery } from '@/components/pro/leads/WallCaptureGallery';
import { MaterialSpecAccordion } from '@/components/pro/leads/MaterialSpecAccordion';
import { ProNotesForm } from '@/components/pro/leads/ProNotesForm';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { getVendorAccess } from '@/lib/pro/access';
import { getVendorLead } from '@/lib/pro/mock-leads';
import { AI_DESIGN_CONCEPTS, getRoomWallSet } from '@/lib/constants/assets';

// Project context that is not gated: a vendor needs the brief to decide
// whether to pursue the lead at all. Only identity is behind the paywall.
const PROJECT_CONTEXT = {
  conceptImage: AI_DESIGN_CONCEPTS[2],
  // Four angles of one room; getRoomWallSet guarantees four different photos.
  wallPhotos: getRoomWallSet('lead-sample').map((url, i) => ({
    id: `w${i + 1}`,
    label: ['Wall A (Front)', 'Wall B (Right)', 'Wall C (Back)', 'Wall D (Left)'][i],
    url,
  })),
  specs: [
    {
      category: 'Color Palette & Lighting',
      items: [
        'Warm Bone White (#FBF9F4) base walls',
        'Matte Charcoal (#1B1C19) accent framing',
        'Diffused perimeter cove lighting (3000K)',
        'Directional spotlighting on key architectural features',
      ],
    },
    {
      category: 'Key Furniture & Materials',
      items: [
        'Low-profile modular sofa in textured Linen Bouclé',
        'Monolithic coffee table in Honed Travertine',
        'Fluted White Oak built-in joinery',
        'Matte Black steel window mullions',
      ],
    },
    {
      category: 'Estimated Scope & Footprint',
      items: [
        'Room Footprint: Approx. 450 sq. ft.',
        'Sourcing Timeline: 6-8 weeks for bespoke items',
        'Contractor Requirement: Light structural (paint & lighting)',
        'Project Tier: Full Furnishing',
      ],
    },
  ],
};

interface ProLeadDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ access?: string }>;
}

export default async function ProLeadDetailPage({ params, searchParams }: ProLeadDetailPageProps) {
  const { id } = await params;
  const { access } = await searchParams;

  // Gate resolved on the server. An unpaid vendor's response never contains
  // the contact values at all.
  const vendorAccess = await getVendorAccess(access);
  const lead = getVendorLead(id, vendorAccess.hasPaidAccess);

  if (!lead) notFound();

  return (
    <div className="min-h-screen bg-[#FBF9F4] text-[#1B1C19] font-body-md flex flex-col relative overflow-hidden">
      <SiteHeader position="fixed" />

      <main className="flex-1 flex flex-col w-full pt-24 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
        <LeadDetailHeader
          leadId={lead.id}
          leadName={lead.customerName}
          roomType={lead.roomType}
          status={lead.status}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
            <SelectedConceptViewer
              imageUrl={PROJECT_CONTEXT.conceptImage}
              style={lead.styleSlug.replace(/_/g, ' ')}
              roomType={lead.roomType}
            />
            <WallCaptureGallery photos={PROJECT_CONTEXT.wallPhotos} />
            <MaterialSpecAccordion specs={PROJECT_CONTEXT.specs} />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8 sticky top-28">
            <CustomerContactCard
              info={{
                name: lead.customerName,
                schedule: 'Preferred: Mornings (9am - 12pm)',
              }}
              lead={lead}
            />
            <ProNotesForm />
          </div>
        </div>
      </main>
    </div>
  );
}
