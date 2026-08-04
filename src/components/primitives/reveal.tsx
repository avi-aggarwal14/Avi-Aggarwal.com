"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { DUR, EASE, viewportOnce } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Seconds. Use to cascade sibling blocks. */
  delay?: number;
  /** Travel distance in px. 0 gives a pure fade. */
  y?: number;
  /** Adds a blur pull-focus. Reserve for headlines — it is expensive. */
  blur?: boolean;
  className?: string;
  as?: "div" | "section" | "li" | "span";
};

/**
 * Scroll-triggered entrance. The workhorse wrapper for every block on the page.
 *
 * Animates once and only once: replaying on every scroll-past is the single
 * fastest way to make an otherwise expensive-looking site feel like a template.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  blur = false,
  className,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={{
        opacity: 0,
        y,
        ...(blur ? { filter: "blur(10px)" } : {}),
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        ...(blur ? { filter: "blur(0px)" } : {}),
      }}
      viewport={viewportOnce}
      transition={{ duration: DUR.slow, ease: EASE.outExpo, delay }}
    >
      {children}
    </MotionTag>
  );
}
