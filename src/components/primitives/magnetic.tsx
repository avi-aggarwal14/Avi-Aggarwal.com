"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Pulls its child gently toward the cursor while hovered, then springs back.
 *
 * Deliberately restrained: 12px default. Magnetic buttons stop feeling
 * expensive and start feeling like a toy around 30px, and become genuinely
 * hard to click past 40. Transform-only, so it never disturbs layout, and the
 * spring MotionValues write straight to the node — no React state, no
 * re-renders on pointer move.
 */
export function Magnetic({
  children,
  strength = 12,
  className,
}: {
  children: ReactNode;
  /** Max travel toward the cursor, in px. */
  strength?: number;
  className?: string;
}) {
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
