"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/content/site";
import { Reveal } from "@/components/primitives/reveal";
import { SectionHeading } from "@/components/primitives/heading";
import { Section, Shell } from "@/components/primitives/shell";

/**
 * Timeline with a scroll-drawn gold spine.
 *
 * A vertical rule runs the height of the list and fills from the top as you
 * scroll through the section — so the line is literally drawn by the act of
 * reading. It is `scaleY` on a transform-origin-top element, which stays on
 * the compositor; animating `height` here would force layout every frame.
 *
 * The line is decorative. Each entry is a semantic `<li>` with its period in
 * an ordinary text node, so the chronology survives with CSS off entirely.
 */
export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 45%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  // Fade the leading edge in rather than snapping it on at zero.
  const glowOpacity = useTransform(scrollYProgress, [0, 0.05, 1], [0, 1, 1]);

  return (
    <Section
      id="timeline"
      wash="tr"
      paths={{ position: -1, intensity: "subtle", count: 22 }}
    >
      <Shell>
        <SectionHeading
          eyebrow={site.timeline.eyebrow}
          heading={site.timeline.heading}
          headingId="timeline-heading"
          index={6}
        />

        <div ref={ref} className="relative">
          {/* Track */}
          <div
            aria-hidden
            className="bg-bone/10 absolute top-2 bottom-2 left-0 w-px md:left-[9.5rem]"
          />
          {/* Gold fill */}
          <motion.div
            aria-hidden
            style={{ scaleY, opacity: glowOpacity }}
            className="absolute top-2 bottom-2 left-0 w-px origin-top md:left-[9.5rem]"
          >
            <div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(214,183,124,0.35), var(--accent))",
              }}
            />
          </motion.div>

          <ol role="list" className="space-y-14 md:space-y-20">
            {site.timeline.entries.map((entry) => (
              <li key={`${entry.period}-${entry.title}`}>
                <Reveal>
                  <div className="grid gap-3 pl-8 md:grid-cols-[9.5rem_1fr] md:gap-10 md:pl-0">
                    <div className="md:pr-10 md:text-right">
                      <span className="text-accent font-mono text-xs tracking-[0.16em] tabular-nums">
                        {entry.period}
                      </span>
                    </div>

                    <div className="relative">
                      {/* Node on the spine */}
                      <span
                        aria-hidden
                        className="bg-ink border-accent absolute top-2 -left-8 h-2.5 w-2.5 -translate-x-[calc(50%-0.5px)] rounded-full border md:-left-10"
                      />

                      <h3 className="font-display text-bone text-2xl md:text-3xl">
                        {entry.title}
                      </h3>
                      <p className="text-bone-muted mt-1 font-mono text-[11px] tracking-[0.16em] uppercase">
                        {entry.org}
                      </p>
                      <p className="text-bone-muted prose-measure mt-4 text-sm leading-relaxed md:text-base">
                        {entry.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Shell>
    </Section>
  );
}
