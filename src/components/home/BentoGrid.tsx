import { site } from '@/content/site'
import { IntroPanel } from './IntroPanel'
import { Tile } from './Tile'

/**
 * §7.1/§7.2 — nested, not flat. Each nesting level responds to hover
 * independently, which is what makes the pure-CSS expand trivial:
 *
 *   root:  38fr 62fr   (intro | right region)
 *   right: 58fr 42fr   (past work | stack)
 *   stack: 50fr 50fr   (current work | bottom row)
 *   bottom:56fr 44fr   (founder | contact)
 *
 * gap: 0 everywhere; separation is 1px hairline borders. The root fills
 * 100dvh minus the nav — the homepage is one screen (§1).
 */
export function BentoGrid() {
  const t = site.tiles
  return (
    <div
      className="bento-root grid h-[calc(100dvh-var(--nav-h))] w-full"
      style={{ gridTemplateColumns: '38fr 62fr' }}
    >
      <IntroPanel />

      <div
        className="bento-row grid border-l border-line"
        style={{ gridTemplateColumns: '58fr 42fr' }}
      >
        <Tile
          label={t.pastWork.label}
          href={t.pastWork.href}
          direction="internal"
          title={t.pastWork.title}
          sub={t.pastWork.sub}
          image="/tiles/past-work.avif"
          preloadImage
        />

        <div
          className="bento-col grid border-l border-line"
          style={{ gridTemplateRows: '50fr 50fr' }}
        >
          <Tile
            label={t.currentWork.label}
            href={t.currentWork.href}
            direction="internal"
            title={t.currentWork.title}
            sub={t.currentWork.sub}
            variant="accent"
          />

          <div
            className="bento-row grid border-t border-line"
            style={{ gridTemplateColumns: '56fr 44fr' }}
          >
            <Tile
              label={t.founderStory.label}
              href={t.founderStory.href}
              direction="internal"
              title={t.founderStory.title}
              sub={t.founderStory.sub}
              variant="invert"
              image="/tiles/founder.avif"
            />
            <Tile
              label={t.contact.label}
              href={t.contact.href}
              direction="external"
              title={t.contact.title}
              sub={t.contact.sub}
              className="border-l border-line"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
