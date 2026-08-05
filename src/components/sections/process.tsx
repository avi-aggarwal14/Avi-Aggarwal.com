"use client";

import { useReducedMotion } from "framer-motion";
import { site } from "@/content/site";
import { pad } from "@/lib/utils";
import { Reveal } from "@/components/primitives/reveal";
import { SectionHeading } from "@/components/primitives/heading";
import { Shell } from "@/components/primitives/shell";
import { SectionPaths } from "@/components/ui/floating-paths";
import {
  CardStackScroll,
  CardStackStage,
  StackCard,
} from "@/components/ui/card-stack";

/**
 * Process — the scroll-driven card stack.
 *
 * The most technical band on the site: a tall scroll container holds a sticky
 * stage, and each card is driven off the container's own scroll progress.
 * Cards arrive rotated and stacked, straighten through their slice of the
 * scroll, then lift away — the reader deals them by scrolling.
 *
 * This section does NOT use the shared <Section> wrapper, because it needs a
 * multi-viewport height and its own sticky stage rather than the standard
 * vertical rhythm.
 *
 * Under reduced motion the stack degrades to a plain numbered list. The
 * stacking is a scroll toy; the steps underneath it are real content, so they
 * stay readable rather than disappearing with the effect.
 */
export function Process() {
  const reduceMotion = useReducedMotion();
  const steps = site.process.steps;

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative scroll-mt-24 overflow-hidden py-24 md:py-32"
    >
      {/* Gold wash from the top — this band is tall, so the light enters
          where the reader does. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(214,183,124,0.06), transparent 30%)",
          zIndex: 0,
        }}
      />
      <SectionPaths position={1} intensity="subtle" count={20} speed={32} />

      <div className="relative z-10">
        <Shell>
          <SectionHeading
            eyebrow={site.process.eyebrow}
            heading={site.process.heading}
            headingId="process-heading"
            index={5}
            aside={reduceMotion ? undefined : site.process.note}
          />
        </Shell>

        {reduceMotion ? (
          <Shell>
            <ol role="list" className="space-y-6">
              {steps.map((step, i) => (
                <li
                  key={step.step}
                  className="border-bone/12 bg-ink-raised/95 rounded-2xl border p-8"
                >
                  <span className="text-accent font-mono text-xs tracking-[0.2em]">
                    {pad(i + 1)}
                  </span>
                  <h3 className="font-display text-bone mt-4 text-3xl">
                    {step.step}
                  </h3>
                  <p className="text-bone-muted mt-3 leading-relaxed">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </Shell>
        ) : (
          <CardStackScroll style={{ height: `${(steps.length + 1) * 70}vh` }}>
            <CardStackStage>
              <Shell>
                {/* The stage is a fixed-height box the cards are pinned in;
                    without it the absolutely-positioned cards would collapse
                    their parent to zero height. */}
                <div className="relative mx-auto h-[26rem] w-full max-w-2xl">
                  {steps.map((step, i) => (
                    <StackCard
                      key={step.step}
                      index={i}
                      total={steps.length}
                      className="flex h-[26rem] flex-col justify-between p-9 md:p-12"
                    >
                      <div className="flex items-start justify-between">
                        <span className="eyebrow">{site.process.eyebrow}</span>
                        <span className="text-accent font-mono text-xs tracking-[0.2em] tabular-nums">
                          {pad(i + 1)} / {pad(steps.length)}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display text-bone text-4xl md:text-5xl">
                          {step.step}
                        </h3>
                        <p className="text-bone-muted mt-5 max-w-lg leading-relaxed">
                          {step.body}
                        </p>
                      </div>

                      <hr className="rule-gilded" />
                    </StackCard>
                  ))}
                </div>
              </Shell>
            </CardStackStage>
          </CardStackScroll>
        )}

        {/* The steps as a real ordered list for assistive tech. The stacked
            cards above are visual; this guarantees the sequence survives
            however the cards happen to be transformed. */}
        {!reduceMotion ? (
          <ol role="list" className="sr-only">
            {steps.map((step) => (
              <li key={`sr-${step.step}`}>
                {step.step}. {step.body}
              </li>
            ))}
          </ol>
        ) : null}

        <Shell>
          <Reveal>
            <hr className="rule mt-4" />
          </Reveal>
        </Shell>
      </div>
    </section>
  );
}
