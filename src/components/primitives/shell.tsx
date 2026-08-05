import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SectionPaths, type PathIntensity } from "@/components/ui/floating-paths";

/**
 * The one container width used everywhere on the site. Mixing max-widths
 * between sections is the quietest way to make a layout feel unresolved.
 */
export function Shell({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  /** Opt up to the full 82rem for the hero and the work list. */
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
   *  across the page rather than dragged the same way every time. */
  position: number;
  intensity?: PathIntensity;
  count?: number;
  speed?: number;
};

/**
 * Gold washes — the warm light that stops a band reading as flat black.
 *
 * Each is a static, very low-alpha champagne gradient painted behind the
 * filaments. Static means composited once and free forever; low-alpha means
 * body text on top never drops below AA. The positions alternate down the
 * page so the light appears to travel with the reader.
 */
const WASHES = {
  tl: "radial-gradient(ellipse 60% 55% at 12% 0%, rgba(214,183,124,0.09), transparent 62%)",
  tr: "radial-gradient(ellipse 60% 55% at 88% 0%, rgba(214,183,124,0.09), transparent 62%)",
  bl: "radial-gradient(ellipse 65% 60% at 10% 100%, rgba(214,183,124,0.08), transparent 62%)",
  br: "radial-gradient(ellipse 65% 60% at 90% 100%, rgba(214,183,124,0.08), transparent 62%)",
  top: "linear-gradient(to bottom, rgba(214,183,124,0.055), transparent 34%)",
  bottom: "linear-gradient(to top, rgba(214,183,124,0.055), transparent 34%)",
} as const;

export type SectionWash = keyof typeof WASHES;

/**
 * Vertical rhythm between sections — one scale, applied consistently.
 *
 * `aria-labelledby` points at the section's own heading (`${id}-heading` by
 * convention), so a screen reader's landmark list reads real names.
 *
 * `paths` lays the gold filament backdrop behind the band; `wash` adds the
 * gold gradient light. Both are handled here so every section gets identical
 * stacking: backdrop at z-0, content lifted to z-10 — an absolutely
 * positioned sibling otherwise paints above in-flow content regardless of
 * source order.
 */
export function Section({
  children,
  id,
  className,
  labelledBy,
  paths,
  wash,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  labelledBy?: string;
  /** Gold filament backdrop. Omit for none. */
  paths?: SectionPathConfig;
  /** Gold gradient wash. Omit for plain ink. */
  wash?: SectionWash;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy ?? (id ? `${id}-heading` : undefined)}
      className={cn("relative scroll-mt-24 overflow-hidden py-24 md:py-36", className)}
    >
      {wash ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: WASHES[wash], zIndex: 0 }}
        />
      ) : null}

      {paths ? (
        <SectionPaths
          position={paths.position}
          intensity={paths.intensity}
          count={paths.count}
          speed={paths.speed}
        />
      ) : null}

      <div className="relative z-10">{children}</div>
    </section>
  );
}
