import { cn } from '@/lib/cn'

/** 1px hairline. The only divider on the site — no gaps, no shadows. */
export function Rule({
  inverted,
  className,
}: {
  inverted?: boolean
  className?: string
}) {
  return (
    <hr
      className={cn(
        'h-px w-full border-0',
        inverted ? 'bg-invert-line' : 'bg-line',
        className,
      )}
    />
  )
}
