"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Plus } from "lucide-react";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { ApiError } from "@/lib/api/client";
import { listProjects, type ProjectSummary } from "@/lib/api/projects";
import { roomLabel, styleLabel } from "@/lib/project/catalog";

/**
 * Where a card sends the customer, based on how far the project got.
 *
 * A half-finished project resumes at the step it stopped on rather than
 * dropping the user at the start of the wizard (PRD s23: "resumable from
 * dashboard").
 */
function destinationFor(project: ProjectSummary): string {
  switch (project.status) {
    case "consultation_requested":
      return `/project/${project.id}/success`;
    case "design_selected":
      return `/project/${project.id}/selected`;
    case "generated":
      return `/project/${project.id}/results`;
    case "generating":
      return `/project/${project.id}/generating`;
    case "ready_for_generation":
    case "photos_uploaded":
      return `/project/${project.id}/generating`;
    default:
      return "/project/new/capture";
  }
}

/** Short, human status. The seven stored states are internal bookkeeping. */
function statusLabel(project: ProjectSummary): string {
  switch (project.status) {
    case "consultation_requested":
      return "Consultation requested";
    case "design_selected":
      return "Concept selected";
    case "generated":
      return `${project.design_count} concept${project.design_count === 1 ? "" : "s"}`;
    case "generating":
      return "Generating…";
    default:
      return `${project.progress.uploaded} of ${project.progress.required} walls`;
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setProjects(await listProjects());
    } catch (caught) {
      // A 401 means the session went away, not that something broke; send them
      // to log in and come back here (PRD s23).
      if (caught instanceof ApiError && caught.status === 401) {
        router.push(`/login?next=${encodeURIComponent("/dashboard")}`);
        return;
      }
      setError("We couldn't load your spaces. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Every setState below happens after an await, so there is no synchronous
    // render cascade for this rule to guard against.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  return (
    <>
      <SiteHeader>
        <Link
          href="/project/new/room-type"
          className="rounded-2xl bg-[#1b1c19] px-5 py-2 font-body text-sm font-medium whitespace-nowrap text-white transition-colors duration-300 hover:bg-black"
        >
          Design My Room
        </Link>
      </SiteHeader>

      <main className="max-w-container-max-app mx-auto px-margin-mobile md:px-lg py-xl md:py-xxl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
          <div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">
              My Spaces
            </h1>
            <p className="font-body-md text-body-md text-secondary">
              Manage and explore your interior design projects.
            </p>
          </div>
          <Link
            href="/project/new/room-type"
            className="px-md py-sm bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:bg-primary-container transition-colors flex items-center gap-sm"
          >
            <Plus className="h-4 w-4" />
            Design a New Room
          </Link>
        </header>

        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 py-32">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            <p className="font-body-md text-body-md text-secondary">Loading your spaces…</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
            <AlertTriangle className="w-8 h-8 text-error" />
            <p className="font-body-lg text-body-lg text-primary">{error}</p>
            <button
              onClick={() => void load()}
              className="bg-primary text-on-primary font-label-sm text-label-sm px-6 py-3 rounded-lg hover:bg-surface-tint transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && projects?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
            <h2 className="font-headline-md text-headline-md text-primary">No projects yet</h2>
            <p className="font-body-md text-body-md text-secondary max-w-[42ch]">
              Capture your four walls and we&apos;ll show you what the room could look like.
            </p>
            <Link
              href="/project/new/room-type"
              className="bg-primary text-on-primary font-label-sm text-label-sm px-6 py-3 rounded-lg hover:bg-surface-tint transition-colors"
            >
              Start Your First Design
            </Link>
          </div>
        )}

        {!isLoading && !error && projects && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={destinationFor(project)}
                className="bg-surface-container-lowest rounded-[16px] ambient-shadow border border-outline-variant/30 overflow-hidden group flex flex-col"
              >
                <div className="relative w-full h-[280px] overflow-hidden bg-surface-container-low">
                  {project.thumbnail_url ? (
                    <Image
                      src={project.thumbnail_url}
                      alt={`${styleLabel(project.style_slug)} ${roomLabel(project.room_type)}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <p className="font-body-md text-body-md text-secondary">
                        No concepts yet
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-lg flex flex-col flex-grow">
                  <h2 className="font-headline-md text-headline-md text-primary mb-sm">
                    {roomLabel(project.room_type)}
                  </h2>
                  <div className="flex gap-sm mb-md flex-wrap">
                    {project.style_slug && (
                      <span className="px-sm py-xs rounded-full bg-surface-variant font-label-sm text-label-sm text-secondary">
                        {styleLabel(project.style_slug)}
                      </span>
                    )}
                    <span className="px-sm py-xs rounded-full bg-surface-variant font-label-sm text-label-sm text-secondary">
                      {statusLabel(project)}
                    </span>
                  </div>
                  <p className="mt-auto font-body-md text-body-md text-secondary">
                    {formatDate(project.created_at)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
