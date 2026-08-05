import Link from "next/link";
import { site } from "@/content/site";
import { SectionPaths } from "@/components/ui/floating-paths";

/**
 * 404.
 *
 * Wears the same clothes as the rest of the site rather than falling back to
 * the framework default — a stock 404 on an otherwise considered site is a
 * seam the visitor can see straight through.
 *
 * A server component: nothing here needs to move.
 */
export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Gold wash rising from the base. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(214,183,124,0.09), transparent 45%)",
        }}
      />

      {/* One bloom, echoing the hero without repeating the whole stack.
          Gradient-only — no blur filter. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(214,183,124,0.14) 0%, rgba(214,183,124,0.05) 40%, transparent 72%)",
        }}
      />

      <SectionPaths position={-1} intensity="present" count={22} speed={32} />

      <div className="relative z-10 mx-auto w-full max-w-2xl px-[var(--gutter)] text-center">
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
