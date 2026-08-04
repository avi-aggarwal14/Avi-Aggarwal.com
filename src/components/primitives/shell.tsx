import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The one container width used everywhere on the site.
 *
 * Mixing `max-w-6xl` in one section and `max-w-7xl` in the next is one of the
 * quietest ways to make a layout feel unresolved — the eye notices that the
 * left edge moves even when the reader could not tell you why. Every section
 * renders inside this.
 */
export function Shell({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  /** Opt out to the full 82rem for the hero and the work list. */
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-[var(--gutter)]",
        wide ? "max-w-[var(--shell)]" : "max-w-6xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Vertical rhythm between sections. One scale, applied consistently, so the
 * page breathes at the same rate from top to bottom.
 */
export function Section({
  children,
  id,
  className,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 py-24 md:py-36", className)}
    >
      {children}
    </section>
  );
}
