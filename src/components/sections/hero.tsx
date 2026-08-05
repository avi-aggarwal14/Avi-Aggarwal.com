"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/content/site";
import { ActionButton } from "@/components/primitives/action-button";
import { HeroChars, HeroIn } from "@/components/primitives/hero-entrance";
import { Shell } from "@/components/primitives/shell";
import { WordRotator } from "@/components/primitives/word-rotator";
import { HeroBackground } from "./hero-background";

/**
 * The hero — v2.
 *
 * ## The entrance is CSS, and that is the whole architecture
 *
 * framer-motion serializes its `initial` state into the server HTML as inline
 * `opacity:0`. In v1 that meant the first paint of this site was a background
 * with no words on it, and it stayed that way until the JS bundle arrived,
 * React hydrated, and a 2.1-second staggered timeline ran. On a cold load
 * that reads as a broken page — it was the "glitching" the whole rebuild is
 * downstream of.
 *
 * So every element above the fold enters on CSS keyframes (`hero-entrance`),
 * which run at first paint and need no JavaScript. The timeline completes in
 * 0.66s. The server HTML contains zero hidden elements above the fold.
 *
 * framer-motion still drives the scroll parallax here — that only matters
 * once you are scrolling, by which point hydration has long since happened.
 *
 * The name is the page's only <h1>.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Parallax: content leaves faster than its background, which reads as depth.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-32 pb-24"
    >
      <HeroBackground />

      <motion.div
        style={
          reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }
        }
        className="relative w-full"
      >
        <Shell wide>
          {/* Eyebrow + domain */}
          <HeroIn
            delay={0.02}
            className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3"
          >
            <span className="eyebrow flex items-center gap-3">
              <span aria-hidden className="bg-accent inline-block h-px w-8" />
              {site.hero.eyebrow}
            </span>
            <span className="text-bone-faint flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase">
              <span
                aria-hidden
                className="bg-accent animate-pulse-soft inline-block h-1.5 w-1.5 rounded-full"
              />
              {site.domain}
            </span>
          </HeroIn>

          {/* The name — the page's single h1 */}
          <h1 className="font-display text-display-xl text-bone">
            <HeroChars text={site.name} delay={0.06} stagger={0.026} />
          </h1>

          {/* Rotating role line, set in the serif italic — the luxury voice,
              spent on exactly one phrase. */}
          <HeroIn
            delay={0.34}
            className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 md:mt-8"
          >
            <span className="text-bone-muted font-mono text-xs tracking-[0.2em] uppercase">
              Currently
            </span>
            <WordRotator
              words={site.hero.roles}
              className="font-display-italic text-accent text-rotator"
              interval={3400}
            />
          </HeroIn>

          {/* Intro */}
          <HeroIn
            as="p"
            delay={0.42}
            className="text-bone-muted prose-measure mt-10 text-base leading-relaxed md:text-lg"
          >
            {site.hero.intro}
          </HeroIn>

          {/* Calls to action */}
          <HeroIn delay={0.52} className="mt-12 flex flex-wrap items-center gap-4">
            <ActionButton href={site.hero.primaryCta.href}>
              {site.hero.primaryCta.label}
            </ActionButton>
            <ActionButton href={site.hero.secondaryCta.href} variant="ghost">
              {site.hero.secondaryCta.label}
            </ActionButton>
          </HeroIn>
        </Shell>
      </motion.div>

      {/* Scroll cue */}
      <HeroIn
        delay={0.66}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="text-bone-faint font-mono text-[10px] tracking-[0.28em] uppercase">
          Scroll
        </span>
        <span className="bg-bone/15 relative h-12 w-px overflow-hidden">
          <span className="bg-accent animate-scroll-cue absolute inset-x-0 h-1/2" />
        </span>
      </HeroIn>
    </section>
  );
}
