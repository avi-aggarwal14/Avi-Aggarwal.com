"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Cycles through a list of words in place, letter by letter — v2.
 *
 * Descended from the `TextRotator` inside the 21st.dev "Classy Hero", with
 * every v1 lesson standing:
 *
 *  · the sizer renders the LONGEST word, so the box never resizes and no
 *    entry is clipped (the source sized from `words[0]`)
 *  · NO `mode="wait"` — outgoing and incoming words overlap and crossfade.
 *    `wait` plus a staggered exit left half a second of empty space per
 *    cycle, which read as the headline flickering
 *  · `initial={false}` — without it, framer serializes the first word into
 *    the server HTML at `opacity:0` and the line is blank until hydration
 *  · letters animate OPACITY AND TRANSFORM ONLY. The v1 blur() filters
 *    promoted every letter to its own GPU layer at each swap, and the layer
 *    churn flashed the whole hero on loaded machines
 *  · rotation stops entirely under reduced motion
 */
export function WordRotator({
  words,
  className,
  interval = 3400,
}: {
  words: string[];
  className?: string;
  /** Milliseconds each word holds before swapping. */
  interval?: number;
}) {
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

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  const current = words[index] ?? "";

  if (reduceMotion) {
    return <span className={className}>{current}</span>;
  }

  return (
    <span className={cn("relative inline-block align-bottom", className)}>
      {/* Invisible sizer — holds the box open at the widest entry. */}
      <span className="invisible" aria-hidden>
        {longest}
      </span>

      <AnimatePresence initial={false}>
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
                hidden: { opacity: 0, y: 16 },
                visible: (n: number) => ({
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: n * 0.028,
                    duration: 0.4,
                    ease: EASE.outQuint,
                  },
                }),
                // The whole word leaves together and quickly — one soft
                // dissolve, no per-letter unravelling.
                exit: {
                  opacity: 0,
                  y: -12,
                  transition: { duration: 0.26, ease: EASE.inOutSoft },
                },
              }}
            >
              {letter === " " ? " " : letter}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
