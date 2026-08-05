import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/cn'
import { Arrow } from '@/components/ui/Arrow'
import { Label } from '@/components/ui/Label'

/**
 * §7.4 — one tile, one <Link>, one tab stop (§14.10: no nested interactive
 * elements). The three-point anchor is `justify-between` on a flex-col:
 * label row pinned top, content pinned bottom, whatever the height — it
 * survives the hover-expand for free.
 *
 * `variant="accent"` uses near-black text (§4.1): white on #FF5A3C is
 * 2.97:1 and fails AA; #0A0A0A is 6.39:1 and turns the tile into a second
 * inversion that strengthens the grid rhythm.
 */
type Props = {
  label: string
  title: React.ReactNode
  sub: string
  href: string
  direction: 'internal' | 'external'
  variant?: 'default' | 'accent' | 'invert'
  image?: string
  /** §9 / Next 16: `preload` marks the LCP image (replaces deprecated `priority`). */
  preloadImage?: boolean
  className?: string
}

export function Tile({
  label,
  title,
  sub,
  href,
  direction,
  variant = 'default',
  image,
  preloadImage,
  className,
}: Props) {
  const invert = variant === 'invert'
  const accent = variant === 'accent'
  return (
    <Link
      href={href}
      data-tile
      data-invert={invert || undefined}
      className={cn(
        'group relative isolate flex flex-col justify-between overflow-hidden',
        'p-[clamp(18px,1.6vw,28px)]',
        variant === 'default' && 'bg-bg-tile',
        accent && 'bg-accent text-on-accent',
        invert && 'bg-invert-bg text-invert-fg',
        className,
      )}
    >
      {image && (
        /* `unoptimized`: the tiles are hand-encoded AVIF at final size, so the
           optimizer adds only a resize — and its AVIF→AVIF re-encode HANGS
           indefinitely on this Next build (verified: /_next/image with
           `Accept: image/avif` never responds; curl without that header
           returns 200, which is why it looked fine from the terminal).
           Serving the committed file directly is faster and cannot hang. */
        <Image
          src={image}
          alt=""
          fill
          unoptimized
          preload={preloadImage}
          sizes="(max-width: 900px) 100vw, 40vw"
          className="-z-10 object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.035]"
        />
      )}

      <div className="flex items-start justify-between">
        <Label inverted={invert} className={cn(accent && '!text-on-accent-dim')}>
          {label}
        </Label>
        <Arrow direction={direction} inverted={invert} />
      </div>

      <div>
        <h2 className="t-tile whitespace-pre-line">{title}</h2>
        <p
          className={cn(
            't-sub mt-2',
            invert && '!text-invert-dim',
            accent && '!text-on-accent-dim',
          )}
        >
          {sub}
        </p>
      </div>
    </Link>
  )
}
