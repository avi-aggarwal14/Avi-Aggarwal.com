import { Reveal, RevealMask } from "./reveal";
import { cn, pad } from "@/lib/utils";

/**
 * The repeating masthead above every section — v2.
 *
 * The consistency is doing more work than any single effect: the same ghost
 * numeral, eyebrow rhythm, gilded rule and reveal timing at the top of every
 * section is what makes seven visually different bands read as one document.
 *
 * New in v2, the luxury details:
 *  · a ghosted oversized serif numeral sits behind the masthead — pure
 *    ornament, outlined not filled, so it textures the space without
 *    shouting
 *  · the rule under the heading is gilded — gold enters at the origin and
 *    hands over to bone
 *
 * A server component. The reveals are CSS scroll-driven.
 */
export function SectionHeading({
  eyebrow,
  heading,
  headingId,
  index,
  aside,
  className,
  as: Tag = "h2",
}: {
  /** Mono micro-label above the heading. */
  eyebrow: string;
  /** The display-serif heading itself. */
  heading: string;
  /** Id the parent <Section> points its aria-labelledby at. */
  headingId?: string;
  /** Section number for the ghost numeral — 1-based. */
  index?: number;
  /** Optional right-aligned aside — a count, a hint, a note. */
  aside?: string;
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <div className={cn("relative mb-14 md:mb-20", className)}>
      {/* Ghost numeral — behind everything, clipped from selection. */}
      {index !== undefined ? (
        <span
          aria-hidden
          className="ghost-numeral absolute -top-10 right-0 md:-top-16"
        >
          {pad(index)}
        </span>
      ) : null}

      <Reveal>
        <div className="flex items-baseline justify-between gap-6">
          <span className="eyebrow flex items-center gap-3">
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

      <RevealMask className="mt-5">
        <Tag
          id={headingId}
          className="font-display text-display-md text-bone"
        >
          {heading}
        </Tag>
      </RevealMask>

      <Reveal>
        <hr className="rule-gilded mt-8" />
      </Reveal>
    </div>
  );
}
