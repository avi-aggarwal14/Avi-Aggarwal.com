"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Hairline reading-progress bar pinned to the top of the viewport.
 *
 * Spring-smoothed rather than bound straight to scroll position: raw
 * `scrollYProgress` jitters with trackpad momentum, and the spring turns that
 * into one continuous sweep. Gold, so it reads as part of the filament
 * language rather than a browser affordance.
 *
 * Purely decorative, so `aria-hidden` — a screen reader announcing a
 * constantly changing value would be noise.
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
      className="fixed top-0 right-0 left-0 h-px origin-left"
    >
      {/* A gradient rather than a flat fill, so the leading edge is brightest
          — the bar looks like it is being drawn, not filled. */}
      <div
        className="h-full w-full"
        style={{
          background:
            "linear-gradient(to right, rgba(214,183,124,0.35), var(--accent))",
        }}
      />
    </motion.div>
  );
}
