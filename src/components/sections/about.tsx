import { site } from "@/content/site";
import { pad } from "@/lib/utils";
import { CountUp } from "@/components/primitives/count-up";
import { Reveal, RevealMask } from "@/components/primitives/reveal";
import { SectionHeading } from "@/components/primitives/heading";
import { Section, Shell } from "@/components/primitives/shell";

/**
 * About — a 5/7 editorial split. A server component; the only client code
 * inside it is the CountUp numerals.
 *
 * The lede is set noticeably larger than the body copy. That single decision
 * does most of the work: it gives the reader an obvious entry point and means
 * the section still communicates to someone who reads only the first
 * sentence, which is most people.
 *
 * The portrait slot renders a framed placeholder until `about.portrait` is
 * filled in, holding the exact aspect ratio the real image will occupy so
 * nothing shifts when the photograph arrives.
 */
export function About() {
  return (
    <Section
      id="about"
      wash="tr"
      paths={{ position: 1, intensity: "subtle", count: 22 }}
    >
      <Shell>
        <SectionHeading
          eyebrow={site.about.eyebrow}
          heading={site.about.heading}
          headingId="about-heading"
          index={1}
        />

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Copy */}
          <div className="lg:col-span-7">
            <RevealMask>
              <p className="font-display text-bone text-2xl leading-snug md:text-[2rem]">
                {site.about.lede}
              </p>
            </RevealMask>

            <div className="prose-measure mt-8 space-y-5">
              {site.about.body.map((paragraph, i) => (
                <Reveal key={i} as="p" className="text-bone-muted leading-relaxed">
                  {paragraph}
                </Reveal>
              ))}
            </div>

            {/* Stats */}
            {site.about.stats.length > 0 ? (
              <Reveal>
                <dl className="border-bone/10 mt-14 grid grid-cols-3 gap-6 border-t pt-8">
                  {/* Index is part of the key: placeholder labels repeat, and
                      real ones legitimately can too. */}
                  {site.about.stats.map((stat, i) => (
                    <div key={`${stat.label}-${i}`}>
                      <dt className="sr-only">{stat.label}</dt>
                      <dd>
                        <span className="font-display text-bone block text-4xl md:text-5xl">
                          <CountUp value={stat.value} />
                        </span>
                        <span className="text-bone-muted mt-2 block font-mono text-[11px] tracking-[0.18em] uppercase">
                          {stat.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : null}
          </div>

          {/* Portrait */}
          <div className="lg:col-span-5">
            <Reveal as="figure" className="relative">
              <div className="border-bone/10 bg-ink-raised relative aspect-[4/5] w-full overflow-hidden rounded-xl border">
                {site.about.portrait ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={site.about.portrait}
                    alt={`Portrait of ${site.name}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PortraitPlaceholder />
                )}

                {/* Inner hairline — catches light at the frame edge. */}
                <div
                  aria-hidden
                  className="ring-bone/10 pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset"
                />
                {/* Gold rim along the top edge, matching the stack cards. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, rgba(214,183,124,0.5), transparent)",
                  }}
                />
              </div>

              <figcaption className="text-bone-faint mt-4 flex items-center justify-between font-mono text-[11px] tracking-[0.18em] uppercase">
                <span>{site.name}</span>
                <span aria-hidden>{pad(1)}</span>
              </figcaption>
            </Reveal>
          </div>
        </div>
      </Shell>
    </Section>
  );
}

/**
 * Stand-in for the portrait: a lattice, a gold bloom and an explicit
 * instruction. Better than a grey box — it holds the exact aspect ratio the
 * real image will occupy, so nothing shifts when the photograph arrives.
 */
function PortraitPlaceholder() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(243,239,231,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(243,239,231,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden
        className="absolute h-64 w-64 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(214,183,124,0.2) 0%, rgba(214,183,124,0.07) 40%, transparent 72%)",
        }}
      />
      <p className="text-bone-faint relative max-w-[16rem] text-center font-mono text-[11px] leading-relaxed tracking-[0.18em] uppercase">
        Portrait
        <span className="text-bone-faint/70 mt-2 block tracking-normal normal-case">
          Drop an image at{" "}
          <code className="text-bone-muted">/public/portrait.jpg</code> and set{" "}
          <code className="text-bone-muted">about.portrait</code> in{" "}
          <code className="text-bone-muted">src/content/site.ts</code>
        </span>
      </p>
    </div>
  );
}
