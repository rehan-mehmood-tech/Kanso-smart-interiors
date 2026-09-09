import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
