import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Open to everything. A portfolio's entire purpose is to be found.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
