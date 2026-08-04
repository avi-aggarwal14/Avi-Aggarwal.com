"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Hairline reading-progress bar pinned to the top of the viewport.
 *
 * Spring-smoothed rather than bound directly to scroll position: raw
 * `scrollYProgress` jitters with trackpad momentum, and the spring turns that
 * into the single continuous sweep you actually want.
 *
 * Purely decorative, so it is `aria-hidden` — a screen reader announcing a
 * constantly-changing progress value would be noise.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, zIndex: "var(--z-float)" }}
      className="bg-accent fixed top-0 right-0 left-0 h-px origin-left"
    />
  );
}
