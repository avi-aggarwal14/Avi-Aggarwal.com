"use client";

import { useEffect, useRef, useState } from "react";
import { lerp } from "@/lib/utils";

/**
 * Custom cursor — a small filled dot with a larger ring trailing behind it.
 *
 * The ring lags the dot on a lerp, so the pointer appears to have inertia. The
 * ring also swells and the dot shrinks over anything interactive, which gives
 * every link and button a second, cursor-side hover affordance on top of its
 * own.
 *
 * Guard rails, because a custom cursor is very easy to get wrong:
 *
 *  - **Pointer-precision gated.** Only mounts behind `(pointer: fine)`. On
 *    touch there is no cursor to replace, and rendering one is pure overhead.
 *  - **Reduced-motion gated.** Someone who has asked for less movement should
 *    not be given an extra moving object that follows them around.
 *  - **The native cursor is never hidden globally.** Hiding `cursor: none` on
 *    `*` is the classic failure — if the JS fails to hydrate, the visitor is
 *    left with no pointer at all. The real cursor stays; this rides along with
 *    it.
 *  - Position is written straight to the node. No state, no re-renders.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const frame = useRef<number | null>(null);

  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);

  // Only run on devices with a precise pointer and no reduced-motion request.
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
        // The dot is exact — it is the pointer.
        dotRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Second, cursor-side hover cue for anything clickable.
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
            ? "border-accent/70 bg-accent/10 h-11 w-11"
            : "border-bone/25 h-7 w-7 bg-transparent"
        }`}
      />
    </>
  );
}
