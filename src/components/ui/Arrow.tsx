import { cn } from '@/lib/cn'

/**
 * §7.5 — hand-drawn 1px arrows. NOT an icon library: the aesthetic depends on
 * line-weight consistency with the 1px hairlines, and icon libs ship 1.5–2px
 * strokes that read chunky next to an 8%-opacity border.
 *
 * Direction is semantic and unexplained (§1.4):
 *   internal ↘ — goes deeper into this site
 *   external ↗ — leaves the site (email, GitHub)
 * On hover each nudges 2px along its own diagonal.
 */
export function Arrow({
  direction,
  inverted,
  className,
}: {
  direction: 'internal' | 'external'
  inverted?: boolean
  className?: string
}) {
  const d = direction === 'external' ? 'M4 12 L12 4 M6 4 H12 V10' : 'M4 4 L12 12 M12 6 V12 H6'
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={cn(
        'h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-0.5',
        direction === 'external' ? 'group-hover:-translate-y-0.5' : 'group-hover:translate-y-0.5',
        className,
      )}
    >
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1" opacity={inverted ? 0.45 : 0.4} />
    </svg>
  )
}
