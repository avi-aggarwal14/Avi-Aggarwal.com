import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Above-the-fold entrance animations, driven entirely by CSS.
 *
 * These exist because framer-motion writes its `initial` state into the
 * server-rendered HTML as an inline `opacity:0`. Below the fold that is
 * harmless. In the hero it meant the first paint of the site contained no
 * readable text at all — just the background — until the JS bundle had
 * downloaded, React had hydrated, and a staggered timeline had run. On a cold
 * load that read as the page being broken.
 *
 * CSS animations run at first paint and do not care whether JavaScript has
 * arrived. Nothing here is a client component, so none of it ships JS at all.
 *
 * `animation-fill-mode: backwards` means an element still holds its hidden
 * state during its delay — so the delays here are deliberately small. The whole
 * hero is in place inside a second.
 */

export function HeroIn({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Seconds. */
  delay?: number;
  className?: string;
  as?: "div" | "p" | "span";
}) {
  return (
    <Tag
      className={cn("hero-in", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </Tag>
  );
}

/**
 * Per-character masked rise, for the hero name.
 *
 * Characters are grouped into words so the line wraps between words and never
 * inside one — the same reason `CharReveal` groups them. The stagger runs
 * continuously across the whole string via each character's absolute index.
 *
 * The full string is exposed once via `aria-label`; the per-character spans are
 * hidden, so a screen reader reads a name rather than a stack of letters.
 */
export function HeroChars({
  text,
  className,
  delay = 0,
  stagger = 0.028,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");
  let cursor = 0;

  return (
    <span aria-label={text} className={cn("inline-flex flex-wrap", className)}>
      {words.map((word, wordIndex) => {
        const isLast = wordIndex === words.length - 1;
        // Non-breaking space: each glyph sits in its own inline-block, and CSS
        // strips white space at the end of a line box. A plain space would
        // collapse and render "AviAggarwal". The wrap opportunity comes from
        // flex-wrap on the parent, so NBSP costs nothing here.
        const glyphs = isLast ? word.split("") : [...word.split(""), " "];

        return (
          <span
            key={`${word}-${wordIndex}`}
            className="inline-flex whitespace-nowrap"
          >
            {glyphs.map((char, i) => {
              const absolute = cursor++;
              return (
                <span
                  key={`${char}-${i}`}
                  aria-hidden
                  className="inline-block overflow-hidden pb-[0.12em]"
                >
                  <span
                    className="hero-char"
                    style={{ animationDelay: `${delay + absolute * stagger}s` }}
                  >
                    {char}
                  </span>
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}
