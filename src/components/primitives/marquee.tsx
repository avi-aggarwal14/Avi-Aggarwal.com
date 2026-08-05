"use client";

import { cn } from "@/lib/utils";

/**
 * Infinite horizontal ticker — pure CSS.
 *
 * The track holds the item list twice and translates by exactly -50%, so the
 * second copy lands where the first began and the loop is seamless. No
 * requestAnimationFrame, nothing to clean up, and it keeps running smoothly
 * while the main thread is busy. Pauses on hover so it can be read — a ticker
 * that cannot be stopped is decoration; one that can is content.
 *
 * The edge fade is inherited from the band that hosts it — no mask here.
 */
export function Marquee({
  items,
  duration = 42,
  separator = "—",
  className,
}: {
  items: string[];
  /** Seconds for one full pass. Higher = slower. */
  duration?: number;
  /** Separator glyph between items. */
  separator?: string;
  className?: string;
}) {
  const track = [...items, ...items];

  return (
    <div
      className={cn(
        "group/marquee relative flex overflow-hidden select-none",
        className,
      )}
      aria-hidden
    >
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
