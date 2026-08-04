"use client";

import React, { useRef } from "react";
// NOTE: the upstream component imports from "motion/react". `motion` is simply
// framer-motion rebranded — same codebase, same maintainers, identical API for
// everything used here. This project already ships framer-motion 12, so
// importing from it avoids installing a second ~50kb copy of the same library.
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * How loudly the paths read. The whole point of this treatment is that it is
 * *atmosphere* — if you can consciously notice it while reading, it is too
 * strong and it has started competing with the content.
 */
export type PathIntensity = "whisper" | "subtle" | "present";

/**
 * Stroke widths are all sub-pixel, which matters more than it looks: a 0.5px
 * line does not render at half intensity, it renders at full colour across
 * roughly half a pixel of antialiased coverage. So the *effective* brightness
 * of every stroke here is its opacity multiplied by its width.
 *
 * That is the whole reason for the tuning below. The obvious move — very low
 * opacity AND very low width — multiplies two small numbers together and the
 * thinnest strokes disappear entirely, leaving DOM nodes that paint nothing.
 * These ranges keep every stroke above the visibility floor while staying
 * comfortably finer than the 0.5 → 1.55 of the source component.
 *
 * Widths top out around 0.75px against the original's 1.55px — filaments
 * rather than ribbons, which is the difference between graphic and expensive.
 */
/**
 * Prominence is carried by OPACITY, not width.
 *
 * That split is deliberate. Making the strokes brighter keeps them visible;
 * making them wider makes them look like ribbons, and "thin" is the whole
 * brief. So opacity roughly tripled from the first pass while widths moved
 * barely at all — still well under the source component's 0.5–1.55px.
 */
const INTENSITY: Record<
  PathIntensity,
  { opacityBase: number; opacityStep: number; widthBase: number; widthStep: number }
> = {
  // Behind the densest, most interactive content.
  // width 0.30 → 0.52, opacity 0.14 → 0.34.
  whisper: { opacityBase: 0.14, opacityStep: 0.0118, widthBase: 0.3, widthStep: 0.013 },
  // The default for body sections.
  // width 0.32 → 0.62, opacity 0.2 → 0.48.
  subtle: { opacityBase: 0.2, opacityStep: 0.0122, widthBase: 0.32, widthStep: 0.013 },
  // Hero, contact, 404 — the moments allowed to be theatrical.
  // width 0.35 → 0.85, opacity 0.26 → 0.62.
  present: { opacityBase: 0.26, opacityStep: 0.0116, widthBase: 0.35, widthStep: 0.0161 },
};

/**
 * Deterministic pseudo-random in [0, 1) from an integer seed.
 *
 * The upstream component calls `Math.random()` inside the transition config to
 * vary each path's duration. That is non-deterministic across a server render
 * and a client render, which is exactly the kind of thing that turns into a
 * hydration bug the moment someone uses the value somewhere it *is* rendered.
 * A hash of the index gives the same visual variety with none of the risk.
 */
function seeded(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function FloatingPathsBackground({
  position,
  children,
  className,
  intensity = "subtle",
  count = 36,
  speed = 26,
}: {
  /** Flow direction and skew. Negative and positive mirror each other. */
  position: number;
  className?: string;
  children?: React.ReactNode;
  /** How prominent the paths are. Default "subtle". */
  intensity?: PathIntensity;
  /** Number of strokes. Fewer is cheaper and calmer. */
  count?: number;
  /** Seconds for one full pass. Higher is slower and more expensive-looking. */
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Only animate while the section is anywhere near the viewport. Without this,
  // every instance on the page runs its full loop permanently — six sections of
  // 24-36 animated strokes each is a lot of stroke-dashoffset repainting for
  // paths nobody is looking at.
  const inView = useInView(ref, { margin: "240px 0px 240px 0px" });

  const tune = INTENSITY[intensity];

  const paths = Array.from({ length: count }, (_, i) => ({
    id: i,
    // Path geometry is kept from the original component — the long, nested
    // sweep is the whole character of the effect.
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    // Hair-thin. The upstream widths (0.5 → 1.55) read as ribbons on a dark
    // field; at a third of that they read as filaments, which is the
    // difference between "graphic" and "expensive".
    width: tune.widthBase + i * tune.widthStep,
    opacity: tune.opacityBase + i * tune.opacityStep,
    duration: speed + seeded(i) * 12,
  }));

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          // Fade the strokes out at every edge so they dissolve into the page
          // instead of being guillotined by the section boundary.
          //
          // The mask is a prominence control in its own right: the first pass
          // held full opacity only to 25% and was fully transparent by 78%,
          // which meant most of every stroke was being faded away before it
          // was ever seen. Widening it to 45% / 96% keeps far more of each
          // sweep at full strength while still avoiding a hard edge.
          maskImage:
            "radial-gradient(ellipse 110% 95% at 50% 50%, black 45%, transparent 96%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 110% 95% at 50% 50%, black 45%, transparent 96%)",
        }}
      >
        <svg
          // text-accent, not a hard-coded gold: the strokes inherit the single
          // --accent token, so changing that one line re-skins these too.
          className="text-accent h-full w-full"
          viewBox="0 0 696 316"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          {paths.map((path) => (
            <motion.path
              key={path.id}
              d={path.d}
              stroke="currentColor"
              strokeWidth={path.width}
              strokeOpacity={path.opacity}
              initial={{ pathLength: 0.3, opacity: 0.6 }}
              animate={
                reduceMotion || !inView
                  ? // Parked: a still, fully-drawn set of filaments. The
                    // texture survives; only the movement stops.
                    { pathLength: 1, opacity: 0.6, pathOffset: 0 }
                  : {
                      pathLength: 1,
                      opacity: [0.35, 0.7, 0.35],
                      pathOffset: [0, 1, 0],
                    }
              }
              transition={
                reduceMotion || !inView
                  ? { duration: 0 }
                  : {
                      duration: path.duration,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }
              }
            />
          ))}
        </svg>
      </div>
      {children}
    </div>
  );
}

/**
 * Section-level convenience wrapper.
 *
 * Renders the paths as a positioned backdrop *behind* a section rather than as
 * a container around it, so existing section markup does not have to be
 * re-nested to gain the treatment. Drop it in as the first child of a
 * `relative` section.
 */
export function SectionPaths({
  position,
  intensity = "subtle",
  count = 24,
  speed = 30,
  className,
}: {
  position: number;
  intensity?: PathIntensity;
  count?: number;
  speed?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      style={{ zIndex: 0 }}
    >
      <FloatingPathsBackground
        position={position}
        intensity={intensity}
        count={count}
        speed={speed}
        className="h-full"
      />
    </div>
  );
}
