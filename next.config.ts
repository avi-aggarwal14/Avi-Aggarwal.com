import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * Nothing here is exotic — this is a static site with no forms, no auth and no
 * user input — but these are free, and a personal domain is exactly the kind of
 * target that gets framed or MIME-sniffed by someone else's page.
 *
 * No CSP: getting one right for Next's inline hydration scripts and
 * `next/font`'s injected styles takes a nonce setup, and a CSP that is wrong is
 * worse than none because it breaks the page silently. Worth adding later.
 */
const securityHeaders = [
  // Deny framing outright — nothing here should ever be embedded.
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers guessing content types.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the origin, not the full path, to other sites.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site asks for none of these; say so explicitly.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  images: {
    // Placeholder imagery is loaded from Unsplash while the portfolio is empty.
    // Swap these hosts out (or drop the block entirely) once real work images
    // live in /public.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
};

export default nextConfig;
