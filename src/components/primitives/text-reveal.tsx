"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  /** Plain string — it gets split on whitespace. */
  text: string;
  className?: string;
  /** Seconds between each word. */
  stagger?: number;
  delay?: number;
  /** Fire on mount instead of on scroll. Use for the hero. */
  immediate?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

/**
 * Masked word-by-word reveal — words slide up out of an invisible horizontal
 * mask, one after another.
 *
 * Pattern taken from the 21st.dev "Masked Slide Reveal" / "Text Reveal (Mask)"
 * family and rebuilt against our own easing tokens. The mask is what separates
 * this from a plain fade-up: because each word is clipped by an
 * `overflow-hidden` parent, it appears to rise from behind the line of text
 * rather than drifting in from empty space.
 *
 * Accessibility: the full string is exposed to assistive tech as one label and
 * the per-word spans are hidden, so a screen reader reads a sentence rather
 * than a stack of disconnected words.
 */
export function TextReveal({
  text,
  className,
  stagger = 0.055,
  delay = 0,
  immediate = false,
  as: Tag = "span",
}: TextRevealProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const animationProps = immediate
    ? { animate: "visible" }
    : { whileInView: "visible", viewport: viewportOnce };

  return (
    <Tag className={className}>
      <motion.span
        aria-label={text}
        className="inline"
        initial="hidden"
        {...animationProps}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            aria-hidden
            // The clipping parent. Bottom padding stops descenders (g, y, p)
            // being sliced off by the overflow.
            className="inline-block overflow-hidden pb-[0.12em] align-bottom"
          >
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "110%" },
                visible: {
                  y: "0%",
                  transition: { duration: 0.85, ease: EASE.outExpo },
                },
              }}
            >
              {word}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/**
 * Character-level variant. Much heavier per node — reserve it for very short
 * strings (the hero name, a single word) and never point it at a paragraph.
 */
export function CharReveal({
  text,
  className,
  stagger = 0.03,
  delay = 0,
}: Omit<TextRevealProps, "as" | "immediate">) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      aria-label={text}
      className={cn("inline-flex", className)}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.12em]"
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              visible: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.9, ease: EASE.outExpo },
              },
            }}
          >
            {char === " " ? " " : char}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
