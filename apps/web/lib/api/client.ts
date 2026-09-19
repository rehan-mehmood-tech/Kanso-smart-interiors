/**
 * Single entry point for calls to the FastAPI backend.
 *
 * Nothing in the app should name a host. In the browser we always call the
 * relative `/api/...` path: on Vercel that is rewritten to the Render service
 * (see next.config.ts), so the request stays same-origin and needs no CORS
 * preflight, and cookies ride along normally.
 *
 * On the server there is no origin to be relative to, so an absolute base is
 * required -- NEXT_PUBLIC_API_URL in a deployment, or the local uvicorn port
 * when developing.
 */

/**
 * Where the backend lives when a request cannot be relative.
 *
 * There is no hardcoded fallback host, in any environment. Local development
 * sets the same variable (see .env.example), so the mechanism is identical
 * everywhere and a stale localhost address can never ship to production.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

export const isApiConfigured = Boolean(API_BASE_URL);

/**
 * Build a URL for an API path.
 *
 * `path` is given without the `/api` prefix, e.g. `projects` or
 * `business/leads`, so callers never repeat the mount point.
 */
export function apiUrl(path: string): string {
  const clean = path.replace(/^\/+/, "");
  // In the browser, stay relative so the rewrite (or a local proxy) handles it.
  if (typeof window !== "undefined") return `/api/${clean}`;
  return `${API_BASE_URL}/api/${clean}`;
}

/**
 * The current Supabase access token, or null when signed out.
 *
 * Read from the Supabase client rather than from storage directly, so a token
 * close to expiry is refreshed by the SDK before it is used. Returns null on
 * any failure -- a missing token must produce a clean 401 from the API, never
 * a crash in the caller.
 */
export async function getAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiErrorBody {
  error?: { code?: string; message?: string; details?: unknown };
}

/**
 * Fetch an API path and unwrap the response.
 *
 * The backend returns one error envelope for every failure
 * (`{ error: { code, message, details } }`), so this turns any non-2xx into an
 * ApiError carrying that code rather than a bare status number.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (typeof window === "undefined" && !isApiConfigured) {
    throw new ApiError(
      "NEXT_PUBLIC_API_URL is not set, so the backend cannot be reached from the server.",
      503,
      "not_configured",
    );
  }

  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  // The API authenticates with the Supabase access token as a bearer header,
  // not with a cookie: it is a separate origin in production, so a
  // Supabase-domain cookie would never be sent to it. An anonymous call is
  // still made when there is no session, so the backend decides the 401
  // rather than the client guessing.
  const token = await getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(apiUrl(path), {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
  });

  if (!response.ok) {
    let body: ApiErrorBody = {};
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      // A non-JSON failure (a gateway error page, say) leaves body empty.
    }
    throw new ApiError(
      body.error?.message ?? `Request to ${path} failed.`,
      response.status,
      body.error?.code ?? "http_error",
      body.error?.details,
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
