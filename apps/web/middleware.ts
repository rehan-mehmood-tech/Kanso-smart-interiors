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
 * Every /pro/* route requires a session; /pro/login is the only exception.
 * The check fails CLOSED — if Supabase is unreachable or unconfigured we
 * cannot prove the visitor is signed in, so we redirect rather than let them
 * through. Before this middleware existed, /pro/dashboard was readable by
 * anyone with the URL, contact details included.
 */

const PROTECTED_PREFIX = "/pro";
const PUBLIC_PRO_PATHS = [VENDOR_LOGIN_PATH];

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = VENDOR_LOGIN_PATH;
  // Preserve where they were heading so login can return them there.
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProRoute = pathname === PROTECTED_PREFIX || pathname.startsWith(`${PROTECTED_PREFIX}/`);
  if (!isProRoute) return NextResponse.next();

  if (PUBLIC_PRO_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // No credentials configured means no session can be verified. Fail closed.
  if (!isSupabaseConfigured) {
    return redirectToLogin(request);
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

  if (!user) return redirectToLogin(request);

  return response;
}

export const config = {
  // Skip static assets and image optimisation so protection costs nothing
  // on the rest of the site.
  matcher: ["/pro/:path*"],
};
