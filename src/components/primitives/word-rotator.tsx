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
 * Adapted from the `TextRotator` inside the 21st.dev "Classy Hero". Three
 * deliberate changes from the original:
 *
 *  1. The original tints each letter with a rotating HSL rainbow. That fights
 *     a one-accent palette, so letters inherit `currentColor` instead and the
 *     motion does the work.
 *  2. The original absolutely-positions the rotating word over a hidden copy of
 *     `words[0]`, which makes the box only as wide as the *first* word and
 *     clips longer ones. Here the sizer renders the *longest* word, so the
 *     container never resizes mid-rotation and nothing gets cut off.
 *  3. The words CROSSFADE. See below — this one was a visible bug.
 *
 * ## Why there is no `mode="wait"`
 *
 * The original wraps the swap in `<AnimatePresence mode="wait">`, and this
 * component inherited it. `mode="wait"` holds the incoming element until the
 * outgoing one has *completely* finished leaving — and with a per-letter exit
 * stagger, "completely finished" meant:
 *
 *     last letter's delay (16 x 0.016s) + its duration (0.26s) = ~0.52s
 *
 * So for over half a second out of every 2.6, there was no word on screen at
 * all: the line read "Currently" followed by empty space. On a headline that is
 * not a subtle imperfection, it is a flicker, and it was the most visible thing
 * on the page.
 *
 * Removing `mode` lets both words exist for the length of the handover. They
 * are both `absolute inset-0`, so they occupy the same box and simply
 * crossfade. The exit also lost its per-letter stagger — the outgoing word now
 * leaves as one object while the incoming one arrives letter by letter, which
 * keeps the entrance detailed without dragging the exit out.
 */
export function WordRotator({
  words,
  className,
  interval = 3200,
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

      {/* No `mode` prop: outgoing and incoming overlap and crossfade. */}
      <AnimatePresence>
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
                    delay: n * 0.028,
                    duration: 0.42,
                    ease: EASE.outQuint,
                  },
                }),
                // No per-letter delay on the way out. The whole word leaves
                // together and quickly, so the handover is one soft dissolve
                // rather than a slow unravelling with a hole at the end of it.
                exit: {
                  opacity: 0,
                  y: -14,
                  filter: "blur(6px)",
                  transition: { duration: 0.28, ease: EASE.inOutSoft },
                },
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
