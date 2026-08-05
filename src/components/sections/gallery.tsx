import { site } from "@/content/site";
import { SectionHeading } from "@/components/primitives/heading";
import { Section, Shell } from "@/components/primitives/shell";
import { DragCarousel } from "@/components/ui/drag-carousel";

/**
 * Gallery — the drag carousel.
 *
 * A deliberate change of gear. Everything above this point is read top to
 * bottom; this band is the one place the page moves sideways, and giving the
 * reader something to physically throw breaks the vertical rhythm better than
 * another stack of cards would.
 *
 * It sits between Capabilities and Process on purpose: after the claims and
 * before the method, where a beat of pure texture is welcome and nothing is
 * being argued.
 *
 * The carousel itself is a client component; this wrapper is not.
 */
export function Gallery() {
  return (
    <Section
      id="gallery"
      wash="br"
      paths={{ position: -1, intensity: "whisper", count: 16, speed: 34 }}
    >
      <Shell wide>
        <SectionHeading
          eyebrow={site.gallery.eyebrow}
          heading={site.gallery.heading}
          headingId="gallery-heading"
          index={4}
          aside={site.gallery.note}
        />

        <DragCarousel frames={site.gallery.frames} />
      </Shell>
    </Section>
  );
}
