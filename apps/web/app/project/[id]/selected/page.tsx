"use client";

import React, { Suspense, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { ConfirmationBanner } from '@/components/selected/ConfirmationBanner';
import { DesignSpecSheet, SpecItem } from '@/components/selected/DesignSpecSheet';
import { DownloadProposalButton } from '@/components/selected/DownloadProposalButton';
import { ConsultationCTASection } from '@/components/selected/ConsultationCTASection';
import { SecondaryNavActions } from '@/components/selected/SecondaryNavActions';
import { SiteHeader } from "@/components/layout/SiteHeader";
import { roomLabel, styleLabel, styleMaterials } from '@/lib/project/catalog';
import { productsForDesign, selectedDesign, useProject } from '@/lib/project/use-project';

/** 45000 -> "PKR 45,000". PKR is the only currency in this product. */
function formatPkr(rupees: number): string {
  return `PKR ${rupees.toLocaleString('en-US')}`;
}

function SelectedContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  // Which concept the customer picked on the results page.
  const designId = searchParams.get('design');

  const { project, isLoading, error } = useProject(projectId);
  const design = selectedDesign(project, designId);
  const products = productsForDesign(project, design);

  const room = roomLabel(project?.room_type ?? null);
  const style = styleLabel(project?.style_slug ?? null);

  /**
   * The specification, built from what the project actually contains.
   *
   * This was a fixed block of copy describing a travertine-and-boucle living
   * room, shown regardless of what had been generated -- including invented
   * figures like a 450 sq ft footprint. Everything here now comes from the
   * project, the chosen concept, or the style palette, and a section that has
   * no real data behind it is left out rather than filled in.
   */
  const specs: SpecItem[] = useMemo(() => {
    if (!project) return [];
    const sheet: SpecItem[] = [];

    const palette = styleMaterials(project.style_slug);
    if (palette.length > 0) {
      sheet.push({
        category: 'Colour Palette & Materials',
        items: palette.map((entry) => `${entry.name} (${entry.color})`),
      });
    }

    if (products.length > 0) {
      sheet.push({
        category: 'Specified Pieces',
        items: products.map((product) => {
          const vendor = product.vendor_name ? ` -- ${product.vendor_name}` : '';
          const material = product.material ? ` in ${product.material}` : '';
          return `${product.name}${material}, ${formatPkr(product.price_pkr)}${vendor}`;
        }),
      });
    }

    const scope: string[] = [`Room: ${room}`, `Style: ${style}`];
    if (project.budget_pkr) scope.push(`Budget ceiling: ${formatPkr(project.budget_pkr)}`);
    if (products.length > 0) {
      const total = products.reduce((sum, product) => sum + product.price_pkr, 0);
      scope.push(`Specified furnishing value: ${formatPkr(total)}`);
    }
    if (project.city) scope.push(`Sourcing city: ${project.city}`);
    sheet.push({ category: 'Scope', items: scope });

    return sheet;
  }, [project, products, room, style]);

  const description = products.length
    ? `A ${style.toLowerCase()} ${room.toLowerCase()}, rendered into the geometry and light of your own space and furnished with ${products.length} ${products.length === 1 ? 'piece' : 'pieces'} available from verified vendors near you.`
    : `A ${style.toLowerCase()} treatment of your ${room.toLowerCase()}, rendered from the four walls you captured.`;

  if (isLoading) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center gap-4 py-32">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          <p className="text-body-md font-body-md text-secondary">Loading your chosen concept...</p>
        </div>
      </Shell>
    );
  }

  if (error || !design) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
          <AlertTriangle className="w-8 h-8 text-error" />
          <p className="text-body-lg font-body-lg text-primary">
            {error ?? 'This project does not have a generated concept to show yet.'}
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <ConfirmationBanner imageUrl={design.signed_url as string} roomLabel={room} />

      <div className="flex justify-end mb-4">
        <DownloadProposalButton />
      </div>

      <DesignSpecSheet description={description} specs={specs} />

      <ConsultationCTASection projectId={projectId} designId={design.id} />

      <SecondaryNavActions projectId={projectId} />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-[#F4F2ED]">
      <SiteHeader position="fixed" />
      <main className="flex-grow pt-24 pb-[80px] px-4 md:px-12 max-w-[1024px] mx-auto w-full flex flex-col">
        {children}
      </main>
    </div>
  );
}

export default function ProjectSelectedPage() {
  // useSearchParams needs a Suspense boundary in the App Router.
  return (
    <Suspense fallback={null}>
      <SelectedContent />
    </Suspense>
  );
}
