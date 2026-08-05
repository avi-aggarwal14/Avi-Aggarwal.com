"use client";

import { ArrowUp } from "lucide-react";
import { site } from "@/content/site";
import { Shell } from "@/components/primitives/shell";
import { SectionPaths } from "@/components/ui/floating-paths";

/**
 * Footer.
 *
 * Kept quiet on purpose. The contact section directly above is the page's
 * closing statement; a heavy footer stacked underneath would compete with it
 * and dilute the ending. This is meta information and a way back up.
 *
 * The filaments continue to the last pixel so the treatment never just stops.
 *
 * The year is computed at render. In a client component that is the visitor's
 * clock rather than build time — which is the behaviour you actually want for
 * a copyright line.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-bone/10 relative overflow-hidden border-t py-12">
      <SectionPaths position={-1} intensity="subtle" count={12} speed={30} />

      <Shell wide className="relative z-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span aria-hidden className="bg-accent h-1.5 w-1.5 rounded-full" />
            <span className="font-display text-bone text-lg">{site.name}</span>
          </div>

          <p className="text-bone-faint font-mono text-[11px] tracking-[0.16em] uppercase">
            {site.footerNote}
          </p>

          <div className="flex items-center gap-6">
            <span className="text-bone-faint font-mono text-[11px] tracking-[0.16em] tabular-nums">
              © {year}
            </span>
            <a
              href="#top"
              aria-label="Back to top"
              className="border-bone/15 text-bone-muted hover:border-accent/60 hover:text-bone group inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200"
            >
              <ArrowUp
                aria-hidden
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </Shell>
    </footer>
  );
}
