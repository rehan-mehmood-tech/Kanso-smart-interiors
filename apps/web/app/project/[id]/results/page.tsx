"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { ResultsHeader } from '@/components/results/ResultsHeader';
import { ConceptCarousel, DesignConcept } from '@/components/results/ConceptCarousel';
import { MaterialPaletteBar, MaterialItem } from '@/components/results/MaterialPaletteBar';
import { VendorProductList } from '@/components/results/VendorProductList';
import { ActionFloatingBar } from '@/components/results/ActionFloatingBar';
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getProject, type MappedProduct, type Project } from '@/lib/api/projects';
import { ApiError } from '@/lib/api/client';
import { roomLabel, styleLabel, styleMaterials } from '@/lib/project/catalog';

/** Concepts are lettered in the order the server ranked them. */
const CONCEPT_LETTERS = ['A', 'B', 'C', 'D'];

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setProject(await getProject(projectId));
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status === 404
          ? 'We could not find this project.'
          : 'We could not load your concepts. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    // Fetch on mount. The rule guards against cascading synchronous renders;
    // every setState in load() happens after an await, so there is no
    // synchronous cascade to avoid here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const room = roomLabel(project?.room_type ?? null);
  const style = styleLabel(project?.style_slug ?? null);

  // Product lookup, so each concept can name the pieces it actually specifies.
  const productsById = useMemo(() => {
    const map = new Map<string, MappedProduct>();
    (project?.products ?? []).forEach((product) => map.set(product.id, product));
    return map;
  }, [project]);

  const concepts: DesignConcept[] = useMemo(() => {
    if (!project) return [];
    return project.designs
      // A design whose signed URL could not be minted has nothing to show.
      .filter((design) => design.signed_url)
      .map((design, index) => {
        const items = design.mapped_products
          .map((id) => productsById.get(id))
          .filter((product): product is MappedProduct => Boolean(product));

        // Features come from the pieces in the render, not from adjectives:
        // these are the materials the customer would actually be buying.
        const features = Array.from(
          new Set(items.map((item) => item.material).filter((m): m is string => Boolean(m))),
        ).slice(0, 4);

        return {
          id: design.id,
          title: `Concept ${CONCEPT_LETTERS[index] ?? index + 1}`,
          description: items.length
            ? `A ${style.toLowerCase()} ${room.toLowerCase()} built around ${items.length} ${
                items.length === 1 ? 'piece' : 'pieces'
              } available from verified vendors near you, rendered into your own room's geometry and light.`
            : `A ${style.toLowerCase()} treatment of your ${room.toLowerCase()}, rendered from the four walls you captured.`,
          image: design.signed_url as string,
          features,
        };
      });
  }, [project, productsById, room, style]);

  // Materials shown are the real colours of the specified products; the style
  // palette is the fallback when a concept has no priced stock behind it.
  const materials: MaterialItem[] = useMemo(() => {
    const fromProducts = (project?.products ?? [])
      .filter((product) => product.color_hex)
      .map((product) => ({
        name: product.material ?? product.name,
        color: product.color_hex as string,
      }));

    if (fromProducts.length > 0) {
      const seen = new Set<string>();
      return fromProducts.filter((item) => {
        const key = `${item.name}|${item.color}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    return styleMaterials(project?.style_slug ?? null);
  }, [project]);

  // Products specified by the concept currently on screen.
  const activeProducts: MappedProduct[] = useMemo(() => {
    if (!project) return [];
    const design = project.designs.filter((d) => d.signed_url)[activeIndex];
    if (!design) return [];
    return design.mapped_products
      .map((id) => productsById.get(id))
      .filter((product): product is MappedProduct => Boolean(product));
  }, [project, productsById, activeIndex]);

  /** The concepts actually renderable, in the order the carousel shows them. */
  const visibleDesigns = useMemo(
    () => (project?.designs ?? []).filter((d) => d.signed_url),
    [project],
  );
  const activeDesign = visibleDesigns[Math.min(activeIndex, visibleDesigns.length - 1)];

  /**
   * Fold a like/save result back into the loaded project.
   *
   * Patching in place rather than refetching keeps the carousel from resetting
   * to the first concept every time the user taps a heart.
   */
  const applyInteraction = useCallback(
    (designId: string, next: { liked?: boolean; saved?: boolean }) => {
      setProject((current) =>
        current
          ? {
              ...current,
              designs: current.designs.map((d) =>
                d.id === designId ? { ...d, ...next } : d,
              ),
            }
          : current,
      );
    },
    [],
  );

  const handleRegenerate = () => router.push(`/project/${projectId}/generating?force=1`);

  return (
    <div className="min-h-screen flex flex-col font-body-md text-on-surface bg-[#F4F2ED]">
      {/* Top Navbar */}
      <SiteHeader position="fixed" />

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-[140px] px-4 md:px-12 max-w-[1024px] mx-auto w-full flex flex-col">
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 py-32">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            <p className="text-body-md font-body-md text-secondary">Loading your concepts...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
            <AlertTriangle className="w-8 h-8 text-error" />
            <p className="text-body-lg font-body-lg text-primary">{error}</p>
            <button
              onClick={() => void load()}
              className="bg-primary text-on-primary font-label-sm text-label-sm px-6 py-3 rounded-lg hover:bg-surface-tint transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && project && (
          <>
            <ResultsHeader
              title={`${room} Concept Deck`}
              styleTag={style}
              onRegenerate={handleRegenerate}
            />

            {concepts.length > 0 ? (
              <>
                <ConceptCarousel
                  concepts={concepts}
                  activeIndex={Math.min(activeIndex, concepts.length - 1)}
                  onIndexChange={setActiveIndex}
                />

                <VendorProductList products={activeProducts} />

                {materials.length > 0 && <MaterialPaletteBar materials={materials} />}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                <p className="text-body-lg font-body-lg text-primary">
                  This project does not have any concepts yet.
                </p>
                <button
                  onClick={() => router.push(`/project/${projectId}/generating`)}
                  className="bg-primary text-on-primary font-label-sm text-label-sm px-6 py-3 rounded-lg hover:bg-surface-tint transition-colors"
                >
                  Generate concepts
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {!isLoading && !error && concepts.length > 0 && (
        <ActionFloatingBar
          projectId={projectId}
          designId={activeDesign?.id}
          liked={activeDesign?.liked ?? false}
          saved={activeDesign?.saved ?? false}
          onInteractionChange={applyInteraction}
        />
      )}
    </div>
  );
}
