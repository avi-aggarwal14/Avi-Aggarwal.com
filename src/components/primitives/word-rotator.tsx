"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type WordRotatorProps = {
  words: string[];
  className?: string;
  /** Milliseconds each word holds before swapping. */
  interval?: number;
};

/**
 * Cycles through a list of words in place, letter by letter.
 *
 * Adapted from the `TextRotator` inside the 21st.dev "Classy Hero". Two
 * deliberate changes from the original:
 *
 *  1. The original tints each letter with a rotating HSL rainbow. That fights
 *     a one-accent palette, so letters inherit `currentColor` instead and the
 *     motion does the work.
 *  2. The original absolutely-positions the rotating word over a hidden copy of
 *     `words[0]`, which makes the box only as wide as the *first* word and
 *     clips longer ones. Here the sizer renders the *longest* word, so the
 *     container never resizes mid-rotation and nothing gets cut off.
 */
export function WordRotator({
  words,
  className,
  interval = 2800,
}: WordRotatorProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || words.length <= 1) return;
    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % words.length),
      interval,
    );
    return () => clearInterval(timer);
  }, [words.length, interval, reduceMotion]);

  // Reserve the width of the longest entry so the line never reflows.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  const current = words[index] ?? "";

  if (reduceMotion) {
    return <span className={className}>{current}</span>;
  }

  return (
    <span className={cn("relative inline-block align-bottom", className)}>
      {/* Invisible sizer — holds the box open. */}
      <span className="invisible" aria-hidden>
        {longest}
      </span>

      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className="absolute inset-0 flex items-baseline justify-start whitespace-nowrap"
          aria-label={current}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {current.split("").map((letter, i) => (
            <motion.span
              key={`${index}-${i}`}
              aria-hidden
              custom={i}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
                visible: (n: number) => ({
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: {
                    delay: n * 0.032,
                    duration: 0.42,
                    ease: EASE.outQuint,
                  },
                }),
                exit: (n: number) => ({
                  opacity: 0,
                  y: -18,
                  filter: "blur(6px)",
                  transition: {
                    delay: n * 0.016,
                    duration: 0.26,
                    ease: EASE.inOutSoft,
                  },
                }),
              }}
            >
              {letter === " " ? " " : letter}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
