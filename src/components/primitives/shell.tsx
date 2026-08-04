import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SectionPaths, type PathIntensity } from "@/components/ui/floating-paths";

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

export type SectionPathConfig = {
  /** Flow direction. Alternate the sign between sections so the eye is led
   *  across the page rather than dragged the same way six times. */
  position: number;
  intensity?: PathIntensity;
  count?: number;
  speed?: number;
};

/**
 * Vertical rhythm between sections. One scale, applied consistently, so the
 * page breathes at the same rate from top to bottom.
 *
 * `aria-labelledby` points at the section's own heading, which is what lets a
 * screen reader's landmark list read "Selected work, region" rather than six
 * identical unnamed regions. The heading ids are derived from the section id,
 * so they stay in sync automatically.
 *
 * Passing `paths` lays the gold filament backdrop behind the section. It is
 * handled here rather than in each section for two reasons: every section then
 * gets identical stacking behaviour, and the content wrapper below is
 * mandatory — an absolutely-positioned sibling paints *above* in-flow content
 * regardless of source order, so without `relative z-10` on the children the
 * strokes would be drawn over the type instead of behind it.
 */
export function Section({
  children,
  id,
  className,
  labelledBy,
  paths,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Id of the heading that names this section. Defaults to `${id}-heading`. */
  labelledBy?: string;
  /** Gold filament backdrop. Omit for no paths. */
  paths?: SectionPathConfig;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy ?? (id ? `${id}-heading` : undefined)}
      className={cn("relative scroll-mt-24 py-24 md:py-36", className)}
    >
      {paths ? (
        <SectionPaths
          position={paths.position}
          intensity={paths.intensity}
          count={paths.count}
          speed={paths.speed}
        />
      ) : null}

      {/* --z-local. Lifts content clear of the absolutely-positioned backdrop. */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
