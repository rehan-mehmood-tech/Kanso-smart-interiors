"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api/client";
import { getProject, type Project } from "@/lib/api/projects";

export type RunStage = "loading" | "analysing" | "rendering" | "done" | "error";

export interface GenerationRun {
  progress: number;
  stage: RunStage;
  /** The project as loaded, so the page can show the customer's own room. */
  project: Project | null;
  error: string | null;
  retry: () => void;
}

/** Server acknowledgement that a run has been recorded and started. */
interface GenerateResponse {
  generation_id: string;
  status: "pending" | "processing" | "succeeded" | "partial" | "failed";
  concepts: { id: string }[];
  detail: string | null;
}

/** How often to ask whether the run has finished. */
const POLL_INTERVAL_MS = 3_000;
/**
 * How long to keep polling before giving up on the run.
 *
 * Generous: two renders against a free provider take one to two minutes, and
 * the provider is rate-limited, so a slow run is normal rather than broken.
 */
const POLL_TIMEOUT_MS = 240_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Where the bar sits when a stage begins. Within a stage it creeps toward the
 * next boundary on elapsed time, so it keeps moving during the long render
 * wait without ever claiming to be finished before the server says so.
 */
const STAGE_FLOOR: Record<RunStage, number> = {
  loading: 0,
  analysing: 12,
  rendering: 40,
  done: 100,
  error: 100,
};
const STAGE_CEILING: Record<RunStage, number> = {
  loading: 12,
  analysing: 40,
  rendering: 95,
  done: 100,
  error: 100,
};
/** Roughly how long each stage takes, used only to pace the creep. */
const STAGE_PACE_MS: Record<RunStage, number> = {
  loading: 1_500,
  analysing: 20_000,
  rendering: 75_000,
  done: 1,
  error: 1,
};

/**
 * Projects whose run this tab has already started.
 *
 * React's development Strict Mode mounts effects twice. Without this guard the
 * second mount fires a second POST, which the server rejects on its
 * one-active-run index -- correct, but it would surface to the customer as an
 * error on a run that is actually fine.
 */
const started = new Set<string>();

/**
 * Run the real generation pipeline for a project and report progress.
 *
 * Replaces the fixed 8-second timer that used to sit here: the bar now tracks
 * an actual server call, and the page only advances to the results once the
 * concepts exist.
 */
export function useGenerationRun(projectId: string, force = false): GenerationRun {
  const router = useRouter();
  const [stage, setStage] = useState<RunStage>("loading");
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [attempt, setAttempt] = useState(0);

  // 0 rather than Date.now(): reading the clock while rendering is impure, and
  // the effect below sets it before the first tick anyway.
  const stageStartedAt = useRef<number>(0);

  // Advance the bar within the current stage. The floor is applied by
  // derivation at the bottom of this hook rather than written here, so
  // entering a stage does not trigger a cascading render.
  useEffect(() => {
    stageStartedAt.current = Date.now();

    if (stage === "done" || stage === "error") return;

    const timer = setInterval(() => {
      const elapsed = Date.now() - stageStartedAt.current;
      const floor = STAGE_FLOOR[stage];
      const ceiling = STAGE_CEILING[stage];
      // Asymptotic: approaches the ceiling without reaching it, so a slow
      // provider never makes the bar sit at 100% while still working.
      const ratio = 1 - Math.exp(-elapsed / STAGE_PACE_MS[stage]);
      setProgress(floor + (ceiling - floor) * ratio);
    }, 100);

    return () => clearInterval(timer);
  }, [stage]);

  const run = useCallback(async () => {
    // Nothing is set synchronously here: this is called from an effect, and a
    // synchronous setState there cascades a render. The initial state is
    // already "loading" with no error, and retry() resets both from an event
    // handler before re-running.
    let loaded: Project;
    try {
      loaded = await getProject(projectId);
      setProject(loaded);
    } catch (caught) {
      setStage("error");
      setError(
        caught instanceof ApiError && caught.status === 404
          ? "We could not find this project."
          : "We could not load your project. Please try again.",
      );
      return;
    }

    // Already generated: nothing to re-run, go straight to the concepts --
    // unless the customer explicitly asked for another pass.
    if (loaded.designs.length > 0 && !force) {
      setStage("done");
      router.replace(`/project/${projectId}/results`);
      return;
    }

    if (started.has(projectId)) return;
    started.add(projectId);

    setStage("analysing");

    let renderingTimer: ReturnType<typeof setTimeout> | undefined;
    try {
      // The server records the run and returns immediately; the pipeline
      // continues behind it. Holding this request open for the full render
      // does not survive a proxy hop -- the Next dev server and Vercel's
      // rewrite both drop the socket long before two renders finish, which
      // orphaned the run mid-flight.
      await apiFetch<GenerateResponse>(`v1/projects/${projectId}/generate`, {
        method: "POST",
        body: JSON.stringify({ count: 2, force }),
      });

      // Analysis comes first and takes about ten seconds; the stage flips on a
      // timer because the server does not stream intermediate progress.
      renderingTimer = setTimeout(() => setStage("rendering"), 12_000);

      // Poll until the run reaches a terminal state.
      const deadline = Date.now() + POLL_TIMEOUT_MS;
      for (;;) {
        await sleep(POLL_INTERVAL_MS);

        let polled: Project;
        try {
          polled = await getProject(projectId);
        } catch {
          // A single failed poll is not a failed run; keep waiting.
          if (Date.now() > deadline) break;
          continue;
        }
        setProject(polled);

        const run = polled.generations[0];
        if (run && (run.status === "succeeded" || run.status === "partial")) {
          clearTimeout(renderingTimer);
          setStage("done");
          setProgress(100);
          router.replace(`/project/${projectId}/results`);
          return;
        }
        if (run && run.status === "failed") {
          clearTimeout(renderingTimer);
          started.delete(projectId);
          setStage("error");
          setError(run.error_detail ?? "No concepts could be rendered for this room.");
          return;
        }
        if (Date.now() > deadline) break;
      }

      clearTimeout(renderingTimer);
      started.delete(projectId);
      setStage("error");
      setError("This render is taking longer than expected. Please try again.");
    } catch (caught) {
      clearTimeout(renderingTimer);
      // A conflict means concepts already exist -- a duplicate submit, not a
      // failure. Show them rather than an error.
      if (caught instanceof ApiError && caught.status === 409 && !force) {
        setStage("done");
        router.replace(`/project/${projectId}/results`);
        return;
      }
      started.delete(projectId);
      setStage("error");
      setError(
        caught instanceof ApiError
          ? caught.message
          : "The design service could not be reached. Please try again.",
      );
    }
  }, [projectId, router, force]);

  useEffect(() => {
    // Starts the pipeline on mount. run() sets no state before its first
    // await, so the cascading render this rule guards against cannot occur.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void run();
  }, [run, attempt]);

  const retry = useCallback(() => {
    started.delete(projectId);
    setError(null);
    setStage("loading");
    setProgress(0);
    setAttempt((n) => n + 1);
  }, [projectId]);

  // The bar never shows less than the current stage's floor, so advancing a
  // stage steps the bar forward without an effect writing to state.
  return { progress: Math.max(progress, STAGE_FLOOR[stage]), stage, project, error, retry };
}
