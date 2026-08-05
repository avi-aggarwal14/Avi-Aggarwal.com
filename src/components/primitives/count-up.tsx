"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";

/**
 * Animated numeral — counts from 0 to its target the first time it enters
 * view, then never again.
 *
 * Built for the stat row: numbers that assemble themselves read as measured
 * confidence, numbers that sit static read as furniture. Details that keep it
 * honest:
 *
 *  · the SERVER HTML contains the final value — the zero state only exists
 *    after hydration, so with JS off (or slow) the real number is simply there
 *  · non-numeric strings ("∞", "n/a") are rendered untouched
 *  · prefixes/suffixes around the number ("12+", "£4k") survive — only the
 *    digits animate
 *  · `tabular-nums` on the host stops the layout breathing while it counts
 *  · reduced motion shows the final value immediately
 */
export function CountUp({ value, duration = 1.4 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current || reduceMotion) return;

    const match = value.match(/^([^0-9]*)(\d[\d,]*)([^0-9]*)$/);
    if (!match) return; // not a number — leave it alone

    started.current = true;
    const [, prefix, digits, suffix] = match;
    const target = parseInt(digits.replace(/,/g, ""), 10);
    const grouped = digits.includes(",");
    const t0 = performance.now();
    let frame = 0;

    const ease = (t: number) => {
      // outExpo curve, evaluated directly.
      const [, , ,] = EASE.outExpo;
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / (duration * 1000));
      const current = Math.round(ease(t) * target);
      const text = grouped ? current.toLocaleString("en-US") : String(current);
      setDisplay(`${prefix}${text}${suffix}`);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduceMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}
