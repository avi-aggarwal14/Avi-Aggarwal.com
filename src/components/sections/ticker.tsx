import { Marquee } from "@/components/primitives/marquee";
import { SectionPaths } from "@/components/ui/floating-paths";
import { site } from "@/content/site";

/**
 * Full-bleed scrolling strip between the hero and the first real section.
 *
 * It does one specific job: the hero is a tall, still, centred block, and
 * dropping straight from it into another tall, still, centred block makes the
 * page feel like a stack of slides. A band of continuous horizontal motion
 * across the full viewport width breaks that rhythm and says "keep going".
 *
 * Hairlines top and bottom rather than a filled panel — a solid band would
 * read as a footer and stop the eye instead of carrying it. The top hairline
 * is gilded, tying the band to the hero's edge light above it.
 *
 * Accessibility: the marquee duplicates its list to make the loop seamless,
 * so it is `aria-hidden`; the same items are rendered once more,
 * visually hidden, as a real list.
 */
export function Ticker() {
  return (
    <div className="border-bone/10 relative overflow-hidden border-y py-6">
      {/* Gilded top hairline. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(214,183,124,0.35), transparent)",
        }}
      />

      {/* Few strokes: the band is only ~90px tall, and a high count here
          compresses into a solid gold haze rather than reading as lines. */}
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
