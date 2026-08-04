"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/content/site";
import { EASE } from "@/lib/motion";
import { ActionButton } from "@/components/primitives/action-button";
import { CharReveal, TextReveal } from "@/components/primitives/text-reveal";
import { Shell } from "@/components/primitives/shell";
import { WordRotator } from "@/components/primitives/word-rotator";
import { HeroBackground } from "./hero-background";

/**
 * The hero.
 *
 * The whole page is judged in the first 400ms, so this is the one place that
 * gets a bespoke entrance rather than the shared <Reveal> treatment:
 *
 *  - the name reveals character by character out of a mask,
 *  - the role line rotates on a loop,
 *  - the entire block drifts up and fades as you scroll away (parallax),
 *  - a scroll cue runs on a slow loop at the base.
 *
 * The name is the page's only <h1>.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Parallax: content leaves faster than the background, which reads as depth.
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
          {/* Eyebrow + availability */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE.outExpo, delay: 0.15 }}
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
          </motion.div>

          {/* The name — the page's single h1 */}
          <h1 className="font-display text-display-xl text-bone">
            <CharReveal text={site.name} delay={0.3} stagger={0.035} />
          </h1>

          {/* Rotating role line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE.outExpo, delay: 1.1 }}
            className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 md:mt-8"
          >
            <span className="text-bone-muted font-mono text-xs tracking-[0.2em] uppercase">
              Currently
            </span>
            <WordRotator
              words={site.hero.roles}
              className="font-display text-accent text-3xl md:text-5xl"
              interval={2600}
            />
          </motion.div>

          {/* Intro */}
          <TextReveal
            as="p"
            text={site.hero.intro}
            immediate
            delay={1.25}
            stagger={0.012}
            className="text-bone-muted prose-measure mt-10 block text-base leading-relaxed md:text-lg"
          />

          {/* Calls to action */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE.outExpo, delay: 1.6 }}
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            <ActionButton href={site.hero.primaryCta.href}>
              {site.hero.primaryCta.label}
            </ActionButton>
            <ActionButton href={site.hero.secondaryCta.href} variant="ghost">
              {site.hero.secondaryCta.label}
            </ActionButton>
          </motion.div>
        </Shell>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.1 }}
        style={{ zIndex: "var(--z-float)" }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
      >
        <span className="text-bone-faint font-mono text-[10px] tracking-[0.28em] uppercase">
          Scroll
        </span>
        <span className="bg-bone/15 relative h-12 w-px overflow-hidden">
          <span className="bg-accent animate-scroll-cue absolute inset-x-0 h-1/2" />
        </span>
      </motion.div>
    </section>
  );
}
