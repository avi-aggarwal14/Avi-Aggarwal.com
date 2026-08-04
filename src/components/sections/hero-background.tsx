"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FloatingPathsBackground } from "@/components/ui/floating-paths";

/**
 * The hero's atmosphere.
 *
 * Adapted from the `HeroBackground` inside the 21st.dev "Classy Hero"
 * (@jatin-yadav05). Seven stacked layers, none of them an image file:
 *
 *   1. dotted lattice     — two offset radial-gradients
 *   2. gold filaments     — the flowing FloatingPaths, drawn in the accent
 *   3. ambient blooms     — slow, blurred radials that breathe
 *   4. vignette           — pulls the eye to the centre
 *   5. sweep highlight    — a diagonal band that crosses on a long cycle
 *   6. edge lighting      — hairlines catching light at the frame
 *   7. horizon glow       — a low warm wash at the base
 *
 * Layer order matters: the filaments sit *above* the lattice but *below* the
 * vignette and blooms, so they are softened by everything on top of them
 * rather than sitting flat on the front of the composition.
 *
 * Changes from the original: the source uses white blooms and a second
 * fine-grain SVG tile; here the blooms carry a trace of the champagne accent
 * so the hero sits in the same palette as the rest of the site, and the grain
 * is dropped because `body.grain` in globals.css already lays a single grain
 * pass over the entire document — running two would double the noise.
 *
 * Everything is `aria-hidden` and every animated property is `opacity` or
 * `transform`, so nothing here touches layout or the accessibility tree.
 */
export function HeroBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 1 — dotted lattice */}
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(243,239,231,0.13) 1px, transparent 1px),
            radial-gradient(circle, rgba(243,239,231,0.13) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px, 32px 32px",
          backgroundPosition: "0 0, 16px 16px",
          // Fade the lattice out toward the bottom so it never fights the copy.
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 35%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 35%, black 20%, transparent 75%)",
        }}
      />

      {/* 2 — gold filaments. The hero gets the fullest treatment: the most
             strokes, the slowest pass, and the "present" intensity. */}
      <FloatingPathsBackground
        position={-1}
        intensity="present"
        count={36}
        speed={30}
        className="absolute inset-0 h-full"
      />

      {/* 3 — ambient blooms */}
      <motion.div
        className="absolute -top-40 -right-32 h-[32rem] w-[32rem] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(214,183,124,0.16) 0%, transparent 70%)",
        }}
        animate={reduceMotion ? undefined : { opacity: [0.55, 0.95, 0.55] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-48 -left-40 h-[36rem] w-[36rem] rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(243,239,231,0.09) 0%, transparent 70%)",
        }}
        animate={reduceMotion ? undefined : { opacity: [0.4, 0.8, 0.4] }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      {/* 4 — vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 30%, rgba(8,8,10,0.72) 100%)",
        }}
      />

      {/* 5 — sweep highlight, on a long cycle so it reads as a glint */}
      {reduceMotion ? null : (
        <motion.div
          className="absolute -inset-full h-[300%] w-[200%] opacity-[0.07]"
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, rgba(243,239,231,0.5) 42%, rgba(214,183,124,0.3) 50%, transparent 62%)",
            transform: "rotate(-14deg)",
          }}
          animate={{ left: ["-110%", "110%"] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatDelay: 9,
            ease: "easeInOut",
          }}
        />
      )}

      {/* 6 — edge lighting */}
      <div className="absolute inset-0">
        <div className="via-bone/20 absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />
        <div className="via-bone/8 absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />
        <div className="from-bone/12 absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b to-transparent" />
        <div className="from-bone/12 absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b to-transparent" />
      </div>

      {/* 7 — horizon glow, tying the hero into the section beneath it */}
      <div
        className="absolute right-0 bottom-0 left-0 h-64"
        style={{
          background:
            "linear-gradient(to top, rgba(214,183,124,0.05), transparent)",
        }}
      />
    </div>
  );
}
