/**
 * Shared motion vocabulary — v2.
 *
 * Much smaller than v1, because the rebuild moved every scroll reveal to CSS
 * scroll-driven animations. framer-motion now touches only six things: the
 * word rotator, the magnetic pull, the nav pill, the timeline spine, the hero
 * parallax and the scroll progress bar. All of them read their curves from
 * here, mirroring the --ease-* tokens in globals.css.
 */

/** Cubic-bezier control points, typed mutable — framer's Easing union
 *  rejects the readonly tuples `as const` would produce. */
type Cubic = [number, number, number, number];

export const EASE = {
  outExpo: [0.16, 1, 0.3, 1] as Cubic,
  outQuint: [0.22, 1, 0.36, 1] as Cubic,
  inOutSoft: [0.65, 0, 0.35, 1] as Cubic,
};

export const DUR = {
  fast: 0.18,
  base: 0.32,
  slow: 0.72,
} as const;
