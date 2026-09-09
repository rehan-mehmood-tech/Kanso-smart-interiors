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
 * The check fails CLOSED — if Supabase is unreachable or unconfigured we
 * cannot prove the visitor is signed in, so we redirect rather than let them
 * through. Before this existed, /pro/dashboard was readable by
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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProRoute = pathname === PROTECTED_PREFIX || pathname.startsWith(`${PROTECTED_PREFIX}/`);
  if (!isProRoute) return NextResponse.next();

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
