"use client";

import { ArrowUp } from "lucide-react";
import { site } from "@/content/site";
import { Shell } from "@/components/primitives/shell";

/**
 * Footer.
 *
 * Kept quiet on purpose. The contact section directly above is the page's
 * closing statement; a heavy footer stacked underneath would compete with it
 * and dilute the ending. This is meta information and a way back up, nothing
 * more.
 *
 * The year is computed at render. On a server component this would be build
 * time — this file is a client component, so it is the visitor's clock, which
 * is the behaviour you actually want for a copyright line.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-bone/10 border-t py-12">
      <Shell wide>
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
              className="border-bone/15 text-bone-muted hover:border-bone/40 hover:text-bone group inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200"
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
