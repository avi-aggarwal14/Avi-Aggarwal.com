import { FloatingPathsBackground } from "@/components/ui/floating-paths";

/**
 * The hero's atmosphere — v2. A SERVER component: not one line of this needs
 * JavaScript, so it paints with the first byte.
 *
 * Seven layers, none of them an image file:
 *
 *   1. gold horizon wash   — warm light rising from the lower third
 *   2. dotted lattice      — two offset radial-gradients
 *   3. ambient blooms      — slow, breathing radials (gradient-only)
 *   4. vignette            — pulls the eye to the centre
 *   5. gold filaments      — the flowing FloatingPaths, above the vignette
 *   6. sweep highlight     — a diagonal glint on a long cycle
 *   7. edge lighting       — hairlines catching light at the frame
 *
 * Two decisions carried from the v1 post-mortems:
 *
 * **The filaments sit ABOVE the vignette.** Below it they were being painted
 * over by `rgba(8,8,10,0.72)` across the outer two-thirds of the hero —
 * present in the DOM and invisible on screen.
 *
 * **No `filter: blur()` anywhere.** v1 blurred the blooms at 120–140px, which
 * is an enormous GPU surface re-rasterized as their opacity breathes. A
 * radial gradient fading to transparent is already soft; the filter bought
 * nothing and churned layers. The sweep animates `transform`, not `left` —
 * animating a layout property forced reflow on every frame of a 16s loop.
 */
export function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 1 — gold horizon wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(214,183,124,0.10) 0%, rgba(214,183,124,0.035) 22%, transparent 55%)",
        }}
      />

      {/* 2 — dotted lattice */}
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(243,239,231,0.13) 1px, transparent 1px),
            radial-gradient(circle, rgba(243,239,231,0.13) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px, 32px 32px",
          backgroundPosition: "0 0, 16px 16px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 35%, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 35%, black 20%, transparent 75%)",
        }}
      />

      {/* 3 — ambient blooms. Gradient-only; the breathing is pure opacity. */}
      <div
        className="animate-bloom absolute -top-40 -right-32 h-[36rem] w-[36rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(214,183,124,0.16) 0%, rgba(214,183,124,0.055) 40%, transparent 72%)",
        }}
      />
      <div
        className="animate-bloom absolute -bottom-48 -left-40 h-[40rem] w-[40rem] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(243,239,231,0.09) 0%, rgba(243,239,231,0.03) 40%, transparent 72%)",
          animationDelay: "2.5s",
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

      {/* 5 — gold filaments, above the vignette so they are actually seen.
             edgeFade off: the opaque ink fade would swallow the blooms, and
             the vignette already softens this band's edges. */}
      <FloatingPathsBackground
        position={-1}
        intensity="present"
        count={26}
        speed={30}
        edgeFade={false}
        className="absolute inset-0 h-full"
      />

      {/* 6 — sweep highlight. Transform-only, on a long cycle so it reads as
             a glint rather than a scanner. */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="animate-sweep absolute -inset-y-full left-0 w-[42%] opacity-[0.06]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(243,239,231,0.5) 45%, rgba(214,183,124,0.35) 55%, transparent)",
          }}
        />
      </div>

      {/* 7 — edge lighting */}
      <div className="absolute inset-0">
        <div className="via-accent/25 absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />
        <div className="via-bone/8 absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />
        <div className="from-bone/12 absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b to-transparent" />
        <div className="from-bone/12 absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b to-transparent" />
      </div>
    </div>
  );
}
