import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
