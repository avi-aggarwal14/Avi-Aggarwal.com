import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Above-the-fold entrances, driven entirely by CSS keyframes.
 *
 * framer-motion serializes its `initial` state into the server HTML as inline
 * `opacity:0` — fatal above the fold, where it once left this site's first
 * paint with a background and no words until hydration finished. CSS
 * animations start at first paint and need no JavaScript; these are server
 * components and ship none.
 *
 * `animation-fill-mode: backwards` holds the hidden state through each delay,
 * so the delays are deliberately short — the hero completes inside a second.
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
 * Per-character masked rise for the hero name.
 *
 * Characters are grouped into words so the line wraps between words, never
 * inside one; the stagger runs continuously across the whole string via each
 * character's absolute index. The full string is exposed once via
 * `aria-label`; the fragments are hidden from assistive tech.
 */
export function HeroChars({
  text,
  className,
  delay = 0,
  stagger = 0.026,
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
        // strips white space at the end of a line box — a plain space would
        // collapse and run the words together. The wrap opportunity comes from
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
