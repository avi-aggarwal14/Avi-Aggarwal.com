import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll reveal — v2. A SERVER component, and that is the whole point.
 *
 * v1 drove reveals with framer-motion's `whileInView`, which meant every
 * below-fold block was serialized into the HTML at `opacity:0` and stayed
 * invisible until JavaScript arrived and an IntersectionObserver fired. Every
 * "blank section" bug this site ever had lived in that gap.
 *
 * v2 reveals are CSS scroll-driven animations (`animation-timeline: view()`,
 * see globals.css). The element is visible by DEFAULT — the animation only
 * exists inside an `@supports` block, so a browser without support, a visitor
 * with JS disabled, or a page mid-hydration simply sees the content. There is
 * no state in which a section can be stuck hidden. As a bonus the reveal is
 * scrubbed by the reader's own scroll, which reads calmer than timers.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "p" | "span" | "li" | "figure";
}) {
  return <Tag className={cn("reveal", className)}>{children}</Tag>;
}

/**
 * Masked rise for display lines: the text lifts out of a clipping wrapper,
 * driven by the same scroll timeline. One element per line — v1's per-word
 * masking below the fold was fussier and bought nothing at reading speed.
 */
export function RevealMask({
  children,
  className,
  innerClassName,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <span className={cn("block overflow-hidden pb-[0.12em]", className)}>
      <span className={cn("reveal-mask block", innerClassName)}>{children}</span>
    </span>
  );
}
