import Link from "next/link";
import { site } from "@/content/site";

/**
 * 404.
 *
 * Wears the same clothes as the rest of the site rather than falling back to
 * the framework default — a stock 404 on an otherwise considered site is a
 * seam the visitor can see straight through.
 *
 * A server component: there is nothing here that needs to move.
 */
export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* One bloom, echoing the hero without repeating the whole stack. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(214,183,124,0.14) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-2xl px-[var(--gutter)] text-center">
        <span className="eyebrow flex items-center justify-center gap-3">
          <span aria-hidden className="bg-accent inline-block h-px w-6" />
          Error
        </span>

        <p className="font-display text-bone mt-8 text-[7rem] leading-none md:text-[10rem]">
          404
        </p>

        <h1 className="font-display text-bone mt-4 text-3xl md:text-4xl">
          This page doesn&rsquo;t exist
        </h1>

        <p className="text-bone-muted mx-auto mt-5 max-w-md leading-relaxed">
          The link may be out of date, or the page may have moved. Everything
          worth seeing is on the home page.
        </p>

        <Link
          href="/"
          className="bg-bone text-ink hover:bg-bone/90 mt-10 inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium transition-colors duration-200"
        >
          Back to {site.shortName}
        </Link>
      </div>
    </main>
  );
}
