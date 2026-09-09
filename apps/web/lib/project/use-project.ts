"use client";

import { useCallback, useEffect, useState } from "react";
import { getProject, type GeneratedDesign, type MappedProduct, type Project } from "@/lib/api/projects";
import { ApiError } from "@/lib/api/client";

export interface ProjectQuery {
  project: Project | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Load a project by id.
 *
 * Shared by the results, selected and consultation pages, which all showed
 * hardcoded stock imagery because none of them ever asked the API what the
 * customer had actually made.
 */
export function useProject(projectId: string): ProjectQuery {
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setProject(await getProject(projectId));
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status === 404
          ? "We could not find this project."
          : "We could not load this project. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    // Fetch on mount. Every setState in load() happens after an await, so the
    // cascading render this rule guards against cannot occur.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return { project, isLoading, error, reload: load };
}

/** Concepts that can actually be displayed, best-ranked first. */
export function displayableDesigns(project: Project | null): GeneratedDesign[] {
  return (project?.designs ?? []).filter((design) => design.signed_url);
}

/**
 * The concept the customer chose.
 *
 * `designId` comes from the results page as a query parameter. Falling back to
 * the top-ranked concept matters: a customer who reaches this page from a
 * bookmark or a shared link has no selection in the URL, and showing them
 * their best concept is right where showing a stock photo never was.
 */
export function selectedDesign(
  project: Project | null,
  designId?: string | null,
): GeneratedDesign | null {
  const available = displayableDesigns(project);
  if (available.length === 0) return null;
  if (designId) {
    const match = available.find((design) => design.id === designId);
    if (match) return match;
  }
  return available[0];
}

/** The vendor products specified by one concept. */
export function productsForDesign(
  project: Project | null,
  design: GeneratedDesign | null,
): MappedProduct[] {
  if (!project || !design) return [];
  const byId = new Map(project.products.map((product) => [product.id, product]));
  return design.mapped_products
    .map((id) => byId.get(id))
    .filter((product): product is MappedProduct => Boolean(product));
}
