import { Nav } from '@/components/Nav'
import { BentoGrid } from '@/components/home/BentoGrid'
import { IntroMotion } from '@/components/home/IntroMotion'

/**
 * §1 — the homepage is a switchboard, not a scroll. Nav + bento fill exactly
 * one screen; the section pages carry the content.
 */
export default function Home() {
  return (
    <main id="top">
      <IntroMotion>
        <Nav />
        <BentoGrid />
      </IntroMotion>
    </main>
  )
}
