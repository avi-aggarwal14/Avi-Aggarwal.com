import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Tile } from '@/components/home/Tile'
import { Rule } from '@/components/ui/Rule'
import { site, type PageSlug } from '@/content/site'

/**
 * §10 — the section pages. One skeleton, four instances, so they read as one
 * system: mono label, big two-tone h1, hairline, 34ch lede, hairline-separated
 * content rows (mono label left / prose right), then the NEXT-SECTION tile at
 * full width — the move that makes the site a loop instead of dead ends.
 *
 * Static params: these three pages prerender; anything else 404s.
 */
export function generateStaticParams() {
  return Object.keys(site.pages).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const page = site.pages[slug as PageSlug]
  return page ? { title: `${page.label} — Avi Aggarwal` } : {}
}

export default async function SectionPage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params
  const page = site.pages[slug as PageSlug]
  if (!page) notFound()

  const nextSlug = page.next
  const nextPage = site.pages[nextSlug]

  return (
    <main>
      <Nav backToTop />

      <article className="px-[clamp(18px,3vw,56px)] pt-[clamp(48px,7vh,96px)]">
        <span className="t-label">{page.label}</span>

        <h1 className="t-hero mt-6 max-w-[16ch]">
          {page.title}
          <span className="text-accent">.</span>
        </h1>

        <Rule className="mt-12" />

        <p className="t-body mt-10 !max-w-[34ch]">{page.lede}</p>

        <div className="mt-20">
          {page.blocks.map((block) => (
            <section key={block.label} className="border-t border-line py-10 min-[900px]:grid min-[900px]:grid-cols-[220px_1fr]">
              <span className="t-label">{block.label}</span>
              <p className="t-body mt-4 min-[900px]:mt-0 !max-w-[52ch]">{block.body}</p>
            </section>
          ))}
        </div>
      </article>

      {/* The loop: same Tile component, full width. */}
      <div className="mt-24 grid h-[38dvh] border-t border-line">
        <Tile
          label={`Next / ${nextPage.label}`}
          href={`/${nextSlug}`}
          direction="internal"
          title={nextPage.title}
          sub={nextPage.lede}
          variant={nextSlug === 'story' ? 'invert' : nextSlug === 'current-work' ? 'accent' : 'default'}
        />
      </div>
    </main>
  )
}
