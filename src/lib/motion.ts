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
 *
 * `once` matters: re-animating on every scroll-past is the fastest way to make
 * a site feel cheap.
 *
 * `margin` matters more than it looks. The bottom edge of the detection area
 * is pushed 240px *below* the viewport, so a block starts revealing before it
 * is on screen rather than after. Without that head start, a fast scroll — or
 * a long smooth-scroll from a nav link, which crosses ~2000px of page — shows
 * section after section as an empty dark panel that only fades in once it has
 * already arrived. That is what made the site look like it was glitching or
 * still loading.
 *
 * `amount` is low for the same reason: waiting for a quarter of a tall block
 * to be visible is a long wait on a 1000px-high section.
 */
export const viewportOnce = {
  once: true,
  amount: 0.1,
  margin: "0px 0px 240px 0px",
} as const;
