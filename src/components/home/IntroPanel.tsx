import { site } from '@/content/site'
import { Rule } from '@/components/ui/Rule'

/**
 * §8.1 — the intro panel. Three-tone headline: line 1 white with an ACCENT
 * PERIOD (only line 1 — accenting all three periods reads as a pattern, not
 * a mark), line 2 grey, line 3 accent. Radar rings behind (§8.2), body copy
 * and the contact row pinned to the bottom.
 */
export function IntroPanel() {
  const h = site.hero
  return (
    <section
      aria-label="Introduction"
      className="relative flex flex-col justify-between overflow-hidden bg-bg p-[clamp(18px,1.8vw,32px)]"
    >
      <RadarRings />

      <h1 className="t-hero hero-h1 relative">
        <span className="block">
          {h.line1}
          <span className="text-accent">.</span>
        </span>
        <span className="block text-fg-mid">{h.line2}</span>
        <span className="block text-accent">{h.line3}</span>
      </h1>

      <div data-intro-body className="relative">
        <p className="t-body">{h.body}</p>
        <Rule className="mt-6 mb-4" />
        <div className="flex items-center justify-between">
          <a href={`mailto:${h.email}`} className="t-label !text-fg hover:!text-fg-muted transition-colors">
            {h.email}
          </a>
          <a
            href={h.github.href}
            target="_blank"
            rel="noreferrer noopener"
            className="t-label hover:!text-fg transition-colors"
          >
            {h.github.label} ↗
          </a>
        </div>
      </div>
    </section>
  )
}

/**
 * §8.2 — three concentric hairline circles plus one accent dot. Inline SVG,
 * not an image, not a canvas. SMIL pulse on the dot costs nothing; the
 * reduced-motion CSS collapses SMIL-adjacent motion by hiding nothing —
 * the dot simply holds at full opacity because animation-duration is
 * forced to 0.01ms only for CSS; SMIL is out of its reach, so we ALSO gate
 * it with a media query in the parent (the whole SVG is decorative).
 */
function RadarRings() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-[0.55] motion-reduce:hidden"
      aria-hidden
    >
      {[70, 130, 190].map((r) => (
        <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="var(--color-line)" strokeWidth="1" />
      ))}
      <circle cx="200" cy="200" r="3.5" fill="var(--color-accent)">
        <animate attributeName="opacity" values="1;0.35;1" dur="3.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}
