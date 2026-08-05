import Link from 'next/link'
import { Nav } from '@/components/Nav'

export default function NotFound() {
  return (
    <main>
      <Nav backToTop />
      <div className="flex h-[calc(100dvh-var(--nav-h))] flex-col items-start justify-between p-[clamp(18px,3vw,56px)]">
        <span className="t-label">404</span>
        <div>
          <h1 className="t-hero">
            Nothing here<span className="text-accent">.</span>
          </h1>
          <p className="t-body mt-8">The page you wanted does not exist. The homepage routes everywhere that does.</p>
          <Link href="/" className="t-label mt-10 inline-block !text-fg hover:!text-fg-muted transition-colors">
            Home ↘
          </Link>
        </div>
        <span aria-hidden className="t-label">00 — 404</span>
      </div>
    </main>
  )
}
