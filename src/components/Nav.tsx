import Link from 'next/link'
import { site } from '@/content/site'

/**
 * §6.3 — 80px nav, three zones: brand / centre links / right meta.
 * Hairline bottom. Mono labels throughout. No hamburger above 900px;
 * below 900px the centre links hide and the brand + meta remain (the
 * tiles themselves are the navigation on mobile).
 */
const links = [
  { label: 'Current work', href: '/current-work' },
  { label: 'Past work', href: '/past-work' },
  { label: 'My story', href: '/story' },
  { label: 'Contact me', href: `mailto:${site.hero.email}` },
]

export function Nav({ backToTop = false }: { backToTop?: boolean }) {
  return (
    <header className="h-[var(--nav-h)] border-b border-line bg-bg">
      <nav
        aria-label="Primary"
        className="grid h-full grid-cols-[1fr_auto_1fr] items-center px-[clamp(18px,1.6vw,28px)]"
      >
        <Link href="/" className="t-label !text-fg hover:!text-fg-muted transition-colors">
          {site.brand.initials} / {site.brand.motto}
        </Link>

        <div className="hidden items-center gap-8 min-[900px]:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="t-label hover:!text-fg transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="justify-self-end">
          {backToTop ? (
            <Link href="/" className="t-label hover:!text-fg transition-colors">
              Home / Back to top
            </Link>
          ) : (
            <a href="#top" className="t-label hover:!text-fg transition-colors">
              Home / Back to top
            </a>
          )}
        </div>
      </nav>
    </header>
  )
}
