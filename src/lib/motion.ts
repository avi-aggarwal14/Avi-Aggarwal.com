import type { Variants } from "framer-motion";

/**
 * Shared motion vocabulary.
 *
 * Every animated element on the site pulls its easing and timing from here, so
 * the page moves like one object rather than a dozen independently-tuned
 * widgets. Mirrors the --ease-* / --dur-* tokens in globals.css.
 */

/** Cubic-bezier control points. Typed as a mutable tuple: framer-motion's
 *  Easing union rejects the readonly arrays that `as const` would produce. */
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

/** Standard "rise into place" entrance. */
export const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.slow, ease: EASE.outExpo },
  },
};

/** Entrance with a blur pull-focus — used for headline words. */
export const riseBlur: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DUR.slow, ease: EASE.outExpo },
  },
};

/** Simple fade, for things that should not move. */
export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DUR.slow, ease: EASE.outExpo } },
};

/** Parent that staggers its children. */
export function stagger(staggerChildren = 0.06, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
  };
}

/**
 * Shared viewport config for scroll-triggered reveals.
 * `once` matters: re-animating on every scroll-past is the fastest way to make
 * a site feel cheap.
 */
export const viewportOnce = { once: true, amount: 0.25 } as const;
