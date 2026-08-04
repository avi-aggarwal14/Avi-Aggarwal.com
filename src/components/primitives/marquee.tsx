"use client";

import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  /** Seconds for one full pass. Higher = slower. */
  duration?: number;
  /** Separator glyph between items. */
  separator?: string;
  className?: string;
};

/**
 * Infinite horizontal ticker.
 *
 * Implemented in pure CSS rather than JS: the track holds the item list twice
 * and translates by exactly -50%, so the second copy lands precisely where the
 * first started and the loop is seamless. No `requestAnimationFrame`, nothing
 * to clean up, and it keeps running smoothly while the main thread is busy.
 *
 * The edges are masked to transparent so items fade out rather than being
 * guillotined by the viewport edge.
 */
export function Marquee({
  items,
  duration = 42,
  separator = "—",
  className,
}: MarqueeProps) {
  // Duplicated once; the -50% translate makes the seam invisible.
  const track = [...items, ...items];

  return (
    <div
      className={cn(
        "group/marquee relative flex overflow-hidden select-none",
        className,
      )}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
      aria-hidden
    >
      {/* Pauses on hover so the strip can actually be read. A ticker that
          cannot be stopped is decoration; one that can is content. */}
      <div
        className="animate-marquee flex shrink-0 items-center gap-8 whitespace-nowrap pr-8 [animation-play-state:running] group-hover/marquee:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8">
            <span className="font-display text-bone/70 text-2xl md:text-3xl">
              {item}
            </span>
            <span className="text-accent/50 text-lg" aria-hidden>
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
