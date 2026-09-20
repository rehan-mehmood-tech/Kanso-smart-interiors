import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  VENDOR_LOGIN_PATH,
  isSupabaseConfigured,
} from "@/lib/supabase/config";

/**
 * Route protection for the vendor portal.
 *
 * Next 16 file convention: this was `middleware.ts` and is now `proxy.ts`
 * exporting `proxy` -- same request-interception behaviour, new name.
 *
 * Every /pro/* route requires a session; /pro/login is the only exception.
 * Every /admin/* route additionally requires profiles.role === 'admin'.
 * Every customer route that talks to the API (/project/*, /dashboard) also
 * requires a session, and is sent to the customer login rather than the
 * vendor one.
 * The check fails CLOSED — if Supabase is unreachable or unconfigured we
 * cannot prove the visitor is signed in, so we redirect rather than let them
 * through. Before this existed, /pro/dashboard was readable by
 * anyone with the URL, contact details included.
 */

const PROTECTED_PREFIX = "/pro";
const ADMIN_PREFIX = "/admin";
const PUBLIC_PRO_PATHS = [VENDOR_LOGIN_PATH];

/**
 * Customer routes that require a session.
 *
 * Every one of these calls the API, which authenticates with the Supabase
 * access token. Without a session the call returns 401 and the page becomes a
 * dead end -- which is exactly what "Missing bearer token" on the review step
 * was: the wizard let an anonymous visitor capture four walls and only failed
 * at the point of creating the project.
 *
 * Guarding the whole wizard, not just its last step, matters: the captured
 * photos live in memory until they are uploaded, so bouncing someone to login
 * from the review screen would discard them. Stopping them at the first step
 * means they log in before there is anything to lose.
 */
const CUSTOMER_PREFIXES = ["/project", "/dashboard"];
const CUSTOMER_LOGIN_PATH = "/login";

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  // Start from a clean query string: cloning keeps the original one, which
  // would spill the wizard's own params (style, budget, ...) onto the login
  // page alongside `next`.
  const destination = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.search = "";
  // Preserve where they were heading, query string included, so login returns
  // them to the exact step they were on.
  url.searchParams.set("next", destination);
  return NextResponse.redirect(url);
}

function redirectToLogin(request: NextRequest) {
  return redirectTo(request, VENDOR_LOGIN_PATH);
}

function redirectToCustomerLogin(request: NextRequest) {
  return redirectTo(request, CUSTOMER_LOGIN_PATH);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProRoute = pathname === PROTECTED_PREFIX || pathname.startsWith(`${PROTECTED_PREFIX}/`);
  const isAdminRoute = pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`);
  const isCustomerRoute = CUSTOMER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (!isProRoute && !isAdminRoute && !isCustomerRoute) return NextResponse.next();

  if (PUBLIC_PRO_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // No credentials configured means no session can be verified.
  //
  // In a local dev server with no Supabase project we let the request through
  // so the portal stays demoable while the backend is being built. This is
  // deliberately narrow: it requires BOTH a development build AND the absence
  // of Supabase config, so a deployed build can never take this path -- there,
  // an unconfigured project fails closed.
  if (!isSupabaseConfigured) {
    if (process.env.NODE_ENV === "development") {
      const response = NextResponse.next({ request });
      response.headers.set("x-kanso-vendor-preview", "unauthenticated-dev");
      return response;
    }
    return isCustomerRoute ? redirectToCustomerLogin(request) : redirectToLogin(request);
  }

  // This response carries any refreshed auth cookies back to the browser.
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser() revalidates against Supabase. Do not trust getSession() here:
  // it reads the cookie without verifying it.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return isCustomerRoute ? redirectToCustomerLogin(request) : redirectToLogin(request);
  }

  // Admin routes need more than a session: the role is read from `profiles`,
  // never from a token claim the client could shape (PRD s19). Anything other
  // than `admin` is bounced rather than shown a partial panel.
  if (isAdminRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  // Skip static assets and image optimisation so protection costs nothing
  // on the rest of the site.
  matcher: ["/pro/:path*", "/admin/:path*", "/project/:path*", "/dashboard/:path*", "/dashboard"],
};
