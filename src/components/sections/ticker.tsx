"use client";

import { Marquee } from "@/components/primitives/marquee";
import { SectionPaths } from "@/components/ui/floating-paths";
import { site } from "@/content/site";

/**
 * Full-bleed scrolling strip between the hero and the first real section.
 *
 * It does one specific job: the hero is a tall, still, centred block, and
 * dropping straight from it into another tall, still, centred block makes the
 * page feel like a stack of slides. A band of continuous horizontal motion
 * across the full viewport width breaks that rhythm and signals "keep going".
 *
 * Hairlines top and bottom rather than a filled panel — a solid band would
 * read as a footer and stop the eye instead of carrying it.
 *
 * Accessibility: the marquee itself is `aria-hidden`, because it duplicates
 * each item and a screen reader would otherwise read the whole list twice, at
 * a position in the document that makes no sense. But the items are real
 * content, so the same list is also rendered visually-hidden — once, in order,
 * as an actual list.
 */
export function Ticker() {
  return (
    <div className="border-bone/10 relative overflow-hidden border-y py-6">
      {/* Few strokes, because the band is only ~90px tall — a high count here
          would compress into a solid gold haze rather than reading as lines. */}
      <SectionPaths position={1} intensity="present" count={12} speed={26} />

      <div className="relative z-10">
        <Marquee items={site.hero.ticker} duration={46} />
      </div>

      <ul role="list" className="sr-only">
        {site.hero.ticker.map((item, i) => (
          <li key={`${item}-${i}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
