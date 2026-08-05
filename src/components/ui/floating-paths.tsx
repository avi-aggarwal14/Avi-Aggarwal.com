"use client";

import React, { useRef } from "react";
// `motion` (the package) is framer-motion rebranded — same codebase, same API.
// This project ships framer-motion 12, so the 21st.dev component's
// `motion/react` import resolves here instead of adding a duplicate library.
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * FloatingPaths — the gold filaments · v2.
 *
 * 21st.dev "Floating Paths" background, rebuilt for this design system. The
 * path geometry is the original's — the long nested sweep IS the effect — and
 * everything about how it renders carries the v1 post-mortems:
 *
 *  · strokes inherit `text-accent`, so `--accent` re-skins them
 *  · hair-thin widths; prominence is bought with OPACITY, never width
 *  · durations are seeded from the index — `Math.random()` in render
 *    diverges between server and client
 *  · the container is pinned to its own compositor layer (`translateZ(0)`),
 *    so Chromium never re-decides its layerization mid-animation — the cause
 *    of the single-frame "waves vanish" flash on GPU-loaded machines
 *  · NO mask-image: a masked container whose children repaint every frame
 *    re-rasterizes the whole masked region continuously. The edge fade is a
 *    static ink-gradient overlay painted above the strokes instead —
 *    visually identical on this ink base, free to composite
 *  · off-screen instances park to a still, fully-drawn state
 *  · reduced motion renders the texture still rather than removing it
 */

export type PathIntensity = "whisper" | "subtle" | "present";

/**
 * Prominence tuning. Sub-pixel strokes render at full colour across partial
 * pixel coverage, so perceived brightness ≈ opacity × width. These ranges keep
 * every stroke above the visibility floor (low-on-both multiplies to nothing)
 * while staying far under the source component's 0.5–1.55px ribbons.
 */
const INTENSITY: Record<
  PathIntensity,
  { opacityBase: number; opacityStep: number; widthBase: number; widthStep: number }
> = {
  // Behind the densest, most interactive content.
  whisper: { opacityBase: 0.14, opacityStep: 0.0118, widthBase: 0.3, widthStep: 0.013 },
  // The default for body sections.
  subtle: { opacityBase: 0.2, opacityStep: 0.0122, widthBase: 0.32, widthStep: 0.013 },
  // Hero, ticker, contact, 404 — the moments allowed to be theatrical.
  present: { opacityBase: 0.26, opacityStep: 0.0116, widthBase: 0.35, widthStep: 0.0161 },
};

/** Deterministic pseudo-random in [0, 1) from an integer seed. */
function seeded(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function FloatingPathsBackground({
  position,
  children,
  className,
  intensity = "subtle",
  count = 24,
  speed = 28,
  edgeFade = true,
}: {
  /** Flow direction and skew. Negative and positive mirror each other. */
  position: number;
  className?: string;
  children?: React.ReactNode;
  /** How loudly the strokes read. */
  intensity?: PathIntensity;
  /** Stroke count. Matched to band height by the caller. */
  count?: number;
  /** Seconds for one pass. Higher is slower and more expensive-looking. */
  speed?: number;
  /**
   * Paint the static ink edge-fade above the strokes. On by default — every
   * plain band sits on the ink token, so the fade is invisible as a surface.
   * The hero disables it: its filaments sit above blooms the opaque fade
   * would swallow, and its own vignette already softens the edges.
   */
  edgeFade?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Animate only near the viewport. At any moment one or two instances run,
  // not all nine.
  const inView = useInView(ref, { margin: "240px 0px 240px 0px" });

  const tune = INTENSITY[intensity];

  const paths = Array.from({ length: count }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: tune.widthBase + i * tune.widthStep,
    opacity: tune.opacityBase + i * tune.opacityStep,
    duration: speed + seeded(i) * 12,
  }));

  const still = reduceMotion || !inView;

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
        // The pinned layer. Without it, Chromium re-layerizes this subtree
        // while the strokes animate, and under GPU load that re-decision can
        // drop the whole SVG for a frame.
        style={{ transform: "translateZ(0)" }}
      >
        <svg
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
                still
                  ? { pathLength: 1, opacity: 0.6, pathOffset: 0 }
                  : {
                      pathLength: 1,
                      opacity: [0.35, 0.7, 0.35],
                      pathOffset: [0, 1, 0],
                    }
              }
              transition={
                still
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

        {/* Static edge fade — composited once, never re-rasterized. */}
        {edgeFade ? (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 110% 95% at 50% 50%, transparent 45%, var(--ink) 96%)",
            }}
          />
        ) : null}
      </div>
      {children}
    </div>
  );
}

/**
 * Section-level wrapper: the filaments as a positioned backdrop behind a
 * band's content, so existing markup gains the treatment without re-nesting.
 * Drop in as the first child of a `relative` container and keep the content
 * in a sibling `relative z-10` wrapper.
 */
export function SectionPaths({
  position,
  intensity = "subtle",
  count = 22,
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
