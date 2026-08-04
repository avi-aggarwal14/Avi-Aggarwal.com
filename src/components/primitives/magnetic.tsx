"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

type MagneticProps = {
  children: ReactNode;
  /** How far the element is allowed to travel toward the cursor, in px. */
  strength?: number;
  className?: string;
};

/**
 * Pulls its child gently toward the cursor while hovered, then springs back.
 *
 * Deliberately restrained: `strength` defaults to 12px. Magnetic buttons stop
 * feeling expensive and start feeling like a toy somewhere around 30px, and
 * they become genuinely hard to click past 40.
 *
 * The element only moves via `transform`, so it never disturbs layout — hover
 * states that reflow the page are the anti-pattern this avoids.
 */
export function Magnetic({ children, strength = 12, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 18, mass: 0.4 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  function handleMove(event: React.MouseEvent<HTMLSpanElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Offset from the element's centre, normalised to -1..1, then scaled.
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(relX * strength * 2);
    y.set(relY * strength * 2);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ x: springX, y: springY, display: "inline-block" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.span>
  );
}
