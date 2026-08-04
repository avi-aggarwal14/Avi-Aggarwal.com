"use client";

import { motion } from "framer-motion";
import { site } from "@/content/site";
import { EASE, viewportOnce } from "@/lib/motion";
import { pad } from "@/lib/utils";
import { Reveal } from "@/components/primitives/reveal";
import { SectionHeading } from "@/components/primitives/section-heading";
import { Section, Shell } from "@/components/primitives/shell";
import { TextReveal } from "@/components/primitives/text-reveal";

/**
 * About â€” a 5/7 editorial split.
 *
 * The lede is set noticeably larger than the body copy that follows. That one
 * decision does most of the work: it gives the reader an obvious entry point
 * and means the section still communicates to someone who only reads the first
 * sentence, which is most people.
 *
 * The portrait slot renders a framed placeholder until `about.portrait` is
 * filled in, so the layout is never missing a limb while the site is empty.
 */
export function About() {
  return (
    // Flow mirrors the hero (which runs at -1), so the eye is carried back
    // across the page rather than dragged the same way twice.
    <Section id="about" paths={{ position: 1, intensity: "subtle", count: 18 }}>
      <Shell>
        <SectionHeading
          eyebrow={site.about.eyebrow}
          heading={site.about.heading}
          headingId="about-heading"
        />

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Copy */}
          <div className="lg:col-span-7">
            <TextReveal
              as="p"
              text={site.about.lede}
              stagger={0.014}
              className="font-display text-bone block text-2xl leading-snug md:text-[2rem]"
            />

            <div className="prose-measure mt-8 space-y-5">
              {site.about.body.map((paragraph, i) => (
                <Reveal key={i} delay={0.1 + i * 0.08} y={18}>
                  <p className="text-bone-muted leading-relaxed">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            {/* Stats */}
            {site.about.stats.length > 0 ? (
              <motion.dl
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                transition={{ staggerChildren: 0.08, delayChildren: 0.2 }}
                className="border-bone/10 mt-14 grid grid-cols-3 gap-6 border-t pt-8"
              >
                {/* Index is part of the key: placeholder labels repeat, and
                    real ones legitimately can too. */}
                {site.about.stats.map((stat, i) => (
                  <motion.div
                    key={`${stat.label}-${i}`}
                    variants={{
                      hidden: { opacity: 0, y: 18 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.7, ease: EASE.outExpo },
                      },
                    }}
                  >
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="font-display text-bone block text-4xl md:text-5xl">
                        {stat.value}
                      </span>
                      <span className="text-bone-muted mt-2 block font-mono text-[11px] tracking-[0.18em] uppercase">
                        {stat.label}
                      </span>
                    </dd>
                  </motion.div>
                ))}
              </motion.dl>
            ) : null}
          </div>

          {/* Portrait */}
          <div className="lg:col-span-5">
            <Reveal delay={0.15} y={28}>
              <figure className="relative">
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

                  {/* Inner hairline â€” catches light at the frame edge. */}
                  <div
                    aria-hidden
                    className="ring-bone/10 pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset"
                  />
                </div>

                <figcaption className="text-bone-faint mt-4 flex items-center justify-between font-mono text-[11px] tracking-[0.18em] uppercase">
                  <span>{site.name}</span>
                  <span aria-hidden>{pad(1)}</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </Shell>
    </Section>
  );
}

/**
 * Stand-in for the portrait: a lattice, a bloom and an explicit instruction.
 * Better than a grey box â€” it holds the exact aspect ratio the real image will
 * occupy, so nothing shifts when the photograph arrives.
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
        className="absolute h-56 w-56 rounded-full blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(214,183,124,0.22) 0%, transparent 70%)",
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
