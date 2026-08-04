"use client";

import { Marquee } from "@/components/primitives/marquee";
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
    <div className="border-bone/10 relative border-y py-6">
      <Marquee items={site.hero.ticker} duration={46} />

      <ul role="list" className="sr-only">
        {site.hero.ticker.map((item, i) => (
          <li key={`${item}-${i}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
