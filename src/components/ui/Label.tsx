import { cn } from '@/lib/cn'

/** Mono micro-label. 10px, tracked wide, uppercase — §4 `.t-label`. */
export function Label({
  children,
  inverted,
  className,
}: {
  children: React.ReactNode
  inverted?: boolean
  className?: string
}) {
  return (
    <span className={cn('t-label', inverted && 'text-invert-dim', className)}>
      {children}
    </span>
  )
}
