/**
 * The in-progress wizard, shared across its four steps.
 *
 * Each step previously kept its own local state, so nothing the customer did
 * survived a navigation: the review page had no access to the photos captured
 * two steps earlier and rendered stock images in their place. This is the one
 * place that state lives.
 *
 * Two kinds of state, stored differently on purpose:
 *
 *   selections  room, style, budget, project id -- small, serialisable, and
 *               mirrored into sessionStorage so a reload keeps them
 *   photos      the actual File objects plus their object URLs, which cannot
 *               be serialised and therefore live only in memory
 *
 * A reload consequently keeps the customer's choices but loses the photos, and
 * the review step detects that and sends them back to re-capture rather than
 * silently generating from nothing.
 */

"use client";

import { useSyncExternalStore } from "react";
import type { WallAngle } from "@/lib/api/projects";
import { WALL_ANGLES } from "@/lib/api/projects";

/** One captured wall, before it has been uploaded. */
export interface WallCapture {
  angle: WallAngle;
  file: File | null;
  /** Object URL for the local preview. Revoked when replaced or cleared. */
  previewUrl: string | null;
}

export interface WizardState {
  roomId: string | null;
  /** Free text, only when roomId is "other". */
  customRoom: string | null;
  styleId: string | null;
  budgetTierId: string | null;
  walls: WallCapture[];
  /** Set once POST /projects has returned. Null before that. */
  projectId: string | null;
}

const STORAGE_KEY = "kanso.wizard.selections";

function emptyWalls(): WallCapture[] {
  return WALL_ANGLES.map((angle) => ({ angle, file: null, previewUrl: null }));
}

let state: WizardState = {
  roomId: null,
  customRoom: null,
  styleId: null,
  budgetTierId: null,
  walls: emptyWalls(),
  projectId: null,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

/** Persist only what can be serialised; File objects never go here. */
function persist() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        roomId: state.roomId,
        customRoom: state.customRoom,
        styleId: state.styleId,
        budgetTierId: state.budgetTierId,
        projectId: state.projectId,
      }),
    );
  } catch {
    // Private-mode or a full quota: the wizard still works within this
    // navigation, it just will not survive a reload.
  }
}

let hydrated = false;

/**
 * Restore selections from sessionStorage once per page load.
 *
 * Called from the store hook rather than at module scope so it never runs
 * during server rendering, where sessionStorage does not exist.
 */
function hydrateOnce() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as Partial<WizardState>;
    state = {
      ...state,
      roomId: saved.roomId ?? null,
      customRoom: saved.customRoom ?? null,
      styleId: saved.styleId ?? null,
      budgetTierId: saved.budgetTierId ?? null,
      projectId: saved.projectId ?? null,
    };
  } catch {
    // Corrupt payload: start clean rather than crash the wizard.
  }
}

function setState(partial: Partial<WizardState>) {
  state = { ...state, ...partial };
  persist();
  emit();
}

// -----------------------------------------------------------------------------
// Mutations
// -----------------------------------------------------------------------------

export function setRoom(roomId: string, customRoom?: string) {
  setState({ roomId, customRoom: customRoom ?? null });
}

export function setStyle(styleId: string) {
  setState({ styleId });
}

export function setBudgetTier(budgetTierId: string) {
  setState({ budgetTierId });
}

export function setProjectId(projectId: string | null) {
  setState({ projectId });
}

/**
 * Attach a file to one wall, replacing whatever was there.
 *
 * The previous object URL is revoked first: without that, replacing a photo
 * several times leaks a blob per replacement for the life of the tab.
 */
export function setWallFile(angle: WallAngle, file: File) {
  const walls = state.walls.map((wall) => {
    if (wall.angle !== angle) return wall;
    if (wall.previewUrl) URL.revokeObjectURL(wall.previewUrl);
    return { ...wall, file, previewUrl: URL.createObjectURL(file) };
  });
  setState({ walls });
}

export function clearWall(angle: WallAngle) {
  const walls = state.walls.map((wall) => {
    if (wall.angle !== angle) return wall;
    if (wall.previewUrl) URL.revokeObjectURL(wall.previewUrl);
    return { ...wall, file: null, previewUrl: null };
  });
  setState({ walls });
}

/** Drop everything, revoking previews. Used when a run finishes. */
export function resetWizard() {
  state.walls.forEach((wall) => {
    if (wall.previewUrl) URL.revokeObjectURL(wall.previewUrl);
  });
  state = {
    roomId: null,
    customRoom: null,
    styleId: null,
    budgetTierId: null,
    walls: emptyWalls(),
    projectId: null,
  };
  persist();
  emit();
}

// -----------------------------------------------------------------------------
// Reads
// -----------------------------------------------------------------------------

/** True when all four walls hold a file. */
export function hasAllWalls(current: WizardState = state): boolean {
  return current.walls.every((wall) => wall.file !== null);
}

/** The captured previews, in wall order. Only walls that have a file. */
export function capturedPreviews(current: WizardState = state): string[] {
  return current.walls
    .filter((wall) => wall.previewUrl !== null)
    .map((wall) => wall.previewUrl as string);
}

/** Every wall that has a file, ready to upload. */
export function pendingUploads(
  current: WizardState = state,
): { angle: WallAngle; file: File }[] {
  return current.walls
    .filter((wall): wall is WallCapture & { file: File } => wall.file !== null)
    .map((wall) => ({ angle: wall.angle, file: wall.file }));
}

export function getWizardState(): WizardState {
  return state;
}

// -----------------------------------------------------------------------------
// React binding
// -----------------------------------------------------------------------------

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): WizardState {
  hydrateOnce();
  return state;
}

/**
 * Stable server snapshot.
 *
 * Returning `state` here would hand the server a store that a previous
 * client-side run had already mutated, so the markup would not match. An empty
 * frozen value keeps the first server and client renders identical, and the
 * real state arrives on the first commit.
 */
const SERVER_SNAPSHOT: WizardState = {
  roomId: null,
  customRoom: null,
  styleId: null,
  budgetTierId: null,
  walls: WALL_ANGLES.map((angle) => ({ angle, file: null, previewUrl: null })),
  projectId: null,
};

function getServerSnapshot(): WizardState {
  return SERVER_SNAPSHOT;
}

/** Subscribe a component to the wizard. */
export function useWizard(): WizardState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
