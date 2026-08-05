"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { clamp, cn } from "@/lib/utils";

export type CarouselFrame = {
  src: string;
  caption: string;
  /** Small mono meta line — a year, a medium, a place. */
  meta: string;
};

/**
 * DragCarousel — the gallery rail.
 *
 * A drag-momentum horizontal carousel in the house language: framer's `drag`
 * with measured constraints, inertial release, a velocity-driven tilt on the
 * cards, and a gold progress rail. The technical parts, and why they are
 * built the way they are:
 *
 *  · **The track position lives in a MotionValue, never React state.** Drag,
 *    momentum, the tilt and the progress rail all read from the same `x`;
 *    nothing re-renders while the rail moves.
 *  · **Constraints are measured, not guessed** — track width minus viewport
 *    width, re-measured on resize, so the rail can never be dragged into
 *    blank space whatever the content file holds.
 *  · **The tilt is velocity-shaped.** Card rotateY follows drag velocity
 *    through a spring, so the cards lean into the direction of travel and
 *    settle upright. Transform-only, springs write straight to the nodes.
 *  · **Arrows are real buttons** with labels, stepping one card with the
 *    same spring the drag uses. The rail is keyboard operable end to end.
 *  · **Reduced motion gets a native scroller.** A plain overflow-x list —
 *    same content, no momentum physics, the browser's own scrolling.
 *
 * The gold rail doubles as the affordance: it fills as you travel, so the
 * carousel communicates its own length without dots.
 */
export function DragCarousel({
  frames,
  className,
}: {
  frames: CarouselFrame[];
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(0);

  const x = useMotionValue(0);
  // The spring drives arrow steps; direct drag writes bypass it naturally.
  const xSpring = useSpring(x, { stiffness: 180, damping: 28, mass: 0.6 });

  // Lean: velocity → a few degrees of rotateY, spring-settled.
  const velocity = useVelocity(x);
  const leanRaw = useTransform(velocity, [-2400, 0, 2400], [5, 0, -5]);
  const lean = useSpring(leanRaw, { stiffness: 220, damping: 30 });

  // Gold rail progress. scaleX from 0→1 across the drag range.
  const progress = useTransform(x, [0, -Math.max(maxDrag, 1)], [0, 1]);
  const progressSpring = useSpring(progress, { stiffness: 200, damping: 32 });

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    setMaxDrag(Math.max(0, track.scrollWidth - viewport.clientWidth));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // One card ≈ the first child's width + gap; measured live so the content
  // file can change card counts freely.
  const step = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      const first = track?.firstElementChild as HTMLElement | null;
      const cardWidth = first ? first.offsetWidth + 28 : 420;
      const next = clamp(x.get() - direction * cardWidth, -maxDrag, 0);
      x.set(next);
    },
    [x, maxDrag],
  );

  if (reduceMotion) {
    // The honest fallback: same frames, native scrolling, zero physics.
    return (
      <div className={cn("relative", className)}>
        <ul
          role="list"
          className="flex gap-7 overflow-x-auto pb-4"
          aria-label="Gallery"
        >
          {frames.map((frame, i) => (
            <li key={`${frame.caption}-${i}`} className="w-[min(78vw,26rem)] shrink-0">
              <FrameCard frame={frame} index={i} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      className={cn("relative", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Gallery"
    >
      <div ref={viewportRef} className="overflow-hidden">
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragTransition={{ power: 0.28, timeConstant: 260 }}
          style={{ x: xSpring }}
          onDragEnd={() => {
            // Fold the settled drag position back into the source value so
            // arrows continue from wherever the momentum stopped.
            x.set(clamp(xSpring.get(), -maxDrag, 0));
          }}
          className="flex cursor-grab touch-pan-y gap-7 active:cursor-grabbing"
        >
          {frames.map((frame, i) => (
            <motion.div
              key={`${frame.caption}-${i}`}
              style={{ rotateY: lean, transformPerspective: 1100 }}
              className="w-[min(78vw,26rem)] shrink-0"
            >
              <FrameCard frame={frame} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Rail + controls */}
      <div className="mt-8 flex items-center gap-6">
        <div className="bg-bone/10 relative h-px flex-1 overflow-hidden">
          <motion.div
            className="bg-accent absolute inset-y-0 left-0 w-full origin-left"
            style={{ scaleX: progressSpring }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous frame"
            className="border-bone/15 text-bone-muted hover:border-accent/60 hover:text-bone inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next frame"
            className="border-bone/15 text-bone-muted hover:border-accent/60 hover:text-bone inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition-colors duration-200"
          >
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

function FrameCard({ frame, index }: { frame: CarouselFrame; index: number }) {
  return (
    <figure className="group">
      <div className="border-bone/10 bg-ink-raised relative aspect-[4/3] overflow-hidden rounded-xl border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={frame.src}
          alt={frame.caption}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {/* Gold-kissed vignette that deepens on hover. */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(to top, rgba(8,8,10,0.55), transparent 45%), linear-gradient(to bottom right, rgba(214,183,124,0.05), transparent 50%)",
          }}
        />
        <div
          aria-hidden
          className="ring-bone/10 pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset"
        />
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-4">
        <span className="text-bone text-sm">{frame.caption}</span>
        <span className="text-bone-faint font-mono text-[11px] tracking-[0.16em] uppercase">
          {frame.meta || `0${index + 1}`}
        </span>
      </figcaption>
    </figure>
  );
}
