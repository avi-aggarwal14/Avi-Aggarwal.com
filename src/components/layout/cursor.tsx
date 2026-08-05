"use client";

import { useEffect, useRef, useState } from "react";
import { lerp } from "@/lib/utils";

/**
 * Custom cursor — a small gold dot with a larger ring trailing behind it.
 *
 * The ring lags the dot on a lerp, so the pointer appears to carry weight.
 * Over anything interactive the ring swells and the dot shrinks, giving every
 * link a second, cursor-side hover cue.
 *
 * Guard rails, because a custom cursor is easy to get wrong:
 *
 *  · **Pointer-precision gated** — only mounts behind `(pointer: fine)`. On
 *    touch there is no cursor to replace and rendering one is pure overhead.
 *  · **Reduced-motion gated** — someone asking for less movement should not
 *    be handed an extra object that follows them around.
 *  · **The native cursor is never hidden.** Setting `cursor: none` globally
 *    is the classic failure: if the JS fails, the visitor has no pointer at
 *    all. This rides alongside the real one.
 *  · Position is written straight to the node inside one rAF loop. No state,
 *    no re-renders on pointer move.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const frame = useRef<number | null>(null);

  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () => setEnabled(fine.matches && !calm.matches);
    evaluate();

    fine.addEventListener("change", evaluate);
    calm.addEventListener("change", evaluate);
    return () => {
      fine.removeEventListener("change", evaluate);
      calm.removeEventListener("change", evaluate);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      if (dotRef.current) {
        // The dot is exact — it IS the pointer.
        dotRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      }
      const el = event.target as HTMLElement | null;
      setHot(Boolean(el?.closest("a, button, [role='button'], input")));
    };

    const tick = () => {
      ring.current.x = lerp(ring.current.x, target.current.x, 0.16);
      ring.current.y = lerp(ring.current.y, target.current.y, 0.16);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }
      frame.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        style={{ zIndex: "var(--z-overlay)" }}
        className={`bg-accent pointer-events-none fixed top-0 left-0 rounded-full transition-[width,height] duration-200 ${
          hot ? "h-1 w-1" : "h-1.5 w-1.5"
        }`}
      />
      <div
        ref={ringRef}
        aria-hidden
        style={{ zIndex: "var(--z-overlay)" }}
        className={`pointer-events-none fixed top-0 left-0 rounded-full border transition-[width,height,border-color,background-color] duration-300 ${
          hot
            ? "border-accent/70 bg-accent-soft h-11 w-11"
            : "border-bone/25 h-7 w-7 bg-transparent"
        }`}
      />
    </>
  );
}
