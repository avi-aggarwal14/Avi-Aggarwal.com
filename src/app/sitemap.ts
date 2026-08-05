import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * One page, one entry. Trivial today — but it exists so the moment case-study
 * routes are added (`/work/[slug]`) there is an obvious place to register
 * them, rather than a sitemap being remembered six months late.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
