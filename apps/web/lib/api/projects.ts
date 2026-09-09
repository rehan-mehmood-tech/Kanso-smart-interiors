/**
 * Typed client for the customer design pipeline.
 *
 * Mirrors apps/api/app/api/v1/{projects,consultations}.py. Every call goes
 * through apiFetch, so the host is never named here -- the browser calls a
 * relative /api path that Vercel rewrites to the Render service.
 */

import { apiFetch, apiUrl, ApiError } from "./client";

export type WallAngle = "north" | "south" | "east" | "west";

export const WALL_ANGLES: readonly WallAngle[] = ["north", "south", "east", "west"] as const;

/** Mirrors the `project_status` enum. */
export type ProjectStatus =
  | "draft"
  | "photos_uploaded"
  | "ready_for_generation"
  | "generating"
  | "generated"
  | "design_selected"
  | "consultation_requested";

export interface WallProgress {
  completed: boolean;
  /** Angles still to capture, e.g. ["west"]. */
  missing: WallAngle[];
  uploaded: number;
  required: number;
}

export interface ProjectPhoto {
  id: string;
  wall_angle: WallAngle;
  /** Object path inside the private bucket. Not directly displayable. */
  image_url: string;
  /** Time-limited URL for display. Null if signing failed. */
  signed_url: string | null;
  metadata: Record<string, unknown>;
}

export interface GeneratedDesign {
  id: string;
  generation_id: string;
  render_url: string;
  signed_url: string | null;
  mapped_products: string[];
  overall_score: number | null;
}

export interface DesignGeneration {
  id: string;
  status: "pending" | "processing" | "succeeded" | "partial" | "failed";
  engine_used: "gemini_flux" | "free_trial";
  error_detail: string | null;
}

/** A catalogue item specified in one or more concepts. */
export interface MappedProduct {
  id: string;
  name: string;
  category: string;
  /** Whole rupees; the backend converts from integer paisa. */
  price_pkr: number;
  material: string | null;
  color_hex: string | null;
  vendor_name: string | null;
  vendor_city: string | null;
}

export interface Project {
  id: string;
  customer_id: string | null;
  city: string | null;
  room_type: string | null;
  style_slug: string | null;
  budget_pkr: number | null;
  status: ProjectStatus;
  created_at: string;
  photos: ProjectPhoto[];
  progress: WallProgress;
  generations: DesignGeneration[];
  /** Empty until a generation run has produced concepts. */
  designs: GeneratedDesign[];
  /**
   * Every product referenced by any design above, resolved to name, price and
   * vendor. Arrives with the project so a results page opened later renders
   * the shopping list without replaying the generation.
   */
  products: MappedProduct[];
}

export interface PhotoUploadResult {
  project_id: string;
  status: ProjectStatus;
  walls: ProjectPhoto[];
  progress: WallProgress;
}

export interface CreateProjectInput {
  city?: string;
  room_type?: string;
  style_slug?: string;
  /** Whole rupees. */
  budget_pkr?: number;
  customer_id?: string;
}

/** POST /api/v1/projects */
export function createProject(input: CreateProjectInput): Promise<Project> {
  return apiFetch<Project>("v1/projects", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** GET /api/v1/projects/:id */
export function getProject(projectId: string): Promise<Project> {
  return apiFetch<Project>(`v1/projects/${projectId}`);
}

/** GET /api/v1/projects/:id/photos */
export function listProjectPhotos(projectId: string): Promise<PhotoUploadResult> {
  return apiFetch<PhotoUploadResult>(`v1/projects/${projectId}/photos`);
}

/**
 * POST /api/v1/projects/:id/photos
 *
 * Sent as multipart, so the browser streams the file rather than inflating it
 * ~33% by base64-encoding it first. Re-uploading an angle replaces it.
 *
 * Content-Type is deliberately not set: the browser must add the multipart
 * boundary itself, and naming the type here would omit it and break parsing.
 */
export async function uploadWallPhoto(
  projectId: string,
  wallAngle: WallAngle,
  file: File,
): Promise<PhotoUploadResult> {
  const form = new FormData();
  form.append("wall_angle", wallAngle);
  form.append("file", file);

  const response = await fetch(apiUrl(`v1/projects/${projectId}/photos`), {
    method: "POST",
    body: form,
    credentials: "include",
  });

  if (!response.ok) {
    let message = `Upload of the ${wallAngle} wall failed.`;
    let code = "http_error";
    try {
      const body = (await response.json()) as {
        error?: { message?: string; code?: string };
      };
      message = body.error?.message ?? message;
      code = body.error?.code ?? code;
    } catch {
      // Non-JSON failure (a gateway page, say); keep the default message.
    }
    throw new ApiError(message, response.status, code);
  }

  return (await response.json()) as PhotoUploadResult;
}

// -----------------------------------------------------------------------------
// Consultations
// -----------------------------------------------------------------------------

export interface AssignedBusiness {
  id: string;
  name: string;
  trade: string | null;
  city: string | null;
}

export interface ConsultationResult {
  lead_id: string;
  status: string;
  /** "assigned" when a vendor matched, "queued" when it went to the admin queue. */
  assignment: "assigned" | "queued";
  business: AssignedBusiness | null;
  /** True when an existing lead for this project was returned instead. */
  deduplicated: boolean;
  message: string;
}

export interface ConsultationInput {
  customer_name: string;
  phone: string;
  email?: string;
  city?: string;
  full_address?: string;
  project_id?: string;
}

/** POST /api/v1/consultations */
export function submitConsultation(input: ConsultationInput): Promise<ConsultationResult> {
  return apiFetch<ConsultationResult>("v1/consultations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/** GET /api/v1/consultations/:id */
export function getConsultation(leadId: string): Promise<ConsultationResult> {
  return apiFetch<ConsultationResult>(`v1/consultations/${leadId}`);
}
