import type { NextConfig } from "next";

/**
 * Backend origin for the FastAPI service on Render.
 *
 * Empty in local development, where the API is reached directly on :8000 and
 * the rewrite below is skipped entirely.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

const nextConfig: NextConfig = {
  /**
   * Proxy /api/* to the Render service.
   *
   * This lives here rather than in vercel.json because Vercel does not
   * interpolate environment variables into a vercel.json rewrite destination --
   * the literal string "$NEXT_PUBLIC_API_URL" would be used as the host. Next's
   * rewrites() runs at build time in Node, so it can read the variable.
   *
   * Rewriting through the same origin also keeps the browser from making a
   * cross-origin call at all, so cookies ride along without a CORS preflight.
   */
  async rewrites() {
    if (!API_URL) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },

  images: {
    // Next 16 requires an explicit allowlist: an unrestricted set would let
    // anyone request arbitrary optimisations. 95 is used by the auth split
    // screens, where the hero image is the whole left half of the viewport.
    qualities: [75, 95],
    // Still required by the app/(preview) Stitch screens, which render remote
    // Unsplash images through next/image. Application code is local-only.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ],
  },
};

export default nextConfig;
