import "server-only";

import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { API_BASE_URL, ApiError } from "./client";

interface ApiErrorBody { error?: { code?: string; message?: string; details?: unknown } }

export async function serverApiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  await connection();
  if (!API_BASE_URL) throw new ApiError("NEXT_PUBLIC_API_URL is not configured.", 503, "not_configured");
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (data.session?.access_token) headers.set("Authorization", `Bearer ${data.session.access_token}`);
  const clean = path.replace(/^\/+/, "");
  const response = await fetch(`${API_BASE_URL}/api/${clean}`, { ...init, headers, cache: "no-store" });
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as ApiErrorBody;
    throw new ApiError(body.error?.message ?? "API request failed.", response.status, body.error?.code ?? "http_error", body.error?.details);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
