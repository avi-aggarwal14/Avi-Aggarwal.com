"use client";

import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Mono micro-label above the heading. */
  eyebrow: string;
  /** The display-serif heading itself. */
  heading: string;
  /**
   * Id for the heading element. `<Section>` points its `aria-labelledby` at
   * `${sectionId}-heading`, so passing the matching value here is what names
   * the region in a screen reader's landmark list.
   */
  headingId?: string;
  /** Optional right-aligned aside — a count, a hint, a note. */
  aside?: string;
  className?: string;
  /** Heading level. Every section on the page uses h2; only the hero is h1. */
  as?: "h2" | "h3";
};

/**
 * The repeating masthead above every section.
 *
 * The consistency here is doing more work than any individual effect: the same
 * eyebrow rhythm, the same rule, the same reveal timing at the top of every
 * section is what makes six visually different blocks read as one document.
 */
export function SectionHeading({
  eyebrow,
  heading,
  headingId,
  aside,
  className,
  as = "h2",
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-14 md:mb-20", className)}>
      <Reveal y={16}>
        <div className="flex items-baseline justify-between gap-6">
          <span className="eyebrow flex items-center gap-3">
            {/* The accent only ever appears in small doses like this. */}
            <span
              aria-hidden
              className="bg-accent inline-block h-px w-6 align-middle"
            />
            {eyebrow}
          </span>
          {aside ? (
            <span className="text-bone-faint hidden font-mono text-xs sm:block">
              {aside}
            </span>
          ) : null}
        </div>
      </Reveal>

      <TextReveal
        as={as}
        id={headingId}
        text={heading}
        delay={0.08}
        className="font-display text-display-md text-bone mt-5 block"
      />

      <Reveal y={0} delay={0.24}>
        <hr className="rule mt-8" />
      </Reveal>
    </div>
  );
}
