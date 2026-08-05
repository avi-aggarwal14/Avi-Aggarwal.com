'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, SplitText)

/**
 * §8.3/§8.4 — load choreography, exact table values:
 *   nav          opacity 0→1        power2.out  0.5s
 *   hero lines   yPercent 116→0     expo.out    1.05s, stagger 0.07, masked
 *   tiles        opacity 0→1        power2.out  0.7s, stagger 0.055, delay 0.28
 *   intro body   opacity 0→1 y10→0  power3.out  0.7s, delay 0.55
 *
 * SplitText with `mask: 'lines'` wraps each line in an overflow clip so the
 * text rises from behind an invisible edge — §8.3 calls this the single
 * strongest reason to use GSAP here. `autoSplit` re-splits after the webfont
 * lands (§14.4), and returning the tween from onSplit re-plays it against
 * the corrected line boxes.
 *
 * Tiles FADE ONLY (§8.4): a grid that assembles from off-screen looks like a
 * template.
 *
 * `gsap.matchMedia` gates everything behind prefers-reduced-motion: in the
 * reduce branch nothing registers, and because `gsap.from()` is what CREATES
 * the hidden state, no-JS or reduced-motion visitors simply see the finished
 * layout — nothing is ever hidden in the server HTML.
 */
export function IntroMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(
        { reduce: '(prefers-reduced-motion: reduce)', ok: '(prefers-reduced-motion: no-preference)' },
        (ctx) => {
          if (ctx.conditions?.reduce) return

          gsap.from('header', { opacity: 0, duration: 0.5, ease: 'power2.out' })

          SplitText.create('.hero-h1 > span', {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 116,
                duration: 1.05,
                stagger: 0.07,
                ease: 'expo.out',
                delay: 0.1,
              })
            },
          })

          gsap.from('[data-tile]', {
            opacity: 0,
            duration: 0.7,
            stagger: 0.055,
            ease: 'power2.out',
            delay: 0.28,
          })

          gsap.from('[data-intro-body]', {
            opacity: 0,
            y: 10,
            duration: 0.7,
            ease: 'power3.out',
            delay: 0.55,
          })
        },
      )
      return () => mm.revert()
    },
    { scope },
  )

  return <div ref={scope}>{children}</div>
}
