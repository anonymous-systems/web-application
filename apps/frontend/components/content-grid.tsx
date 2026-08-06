import { JSX, ReactNode } from 'react'
import { cn } from '@workspace/ui/lib/utils'

interface Props {
  children: ReactNode
  className?: string
}

/**
 * The responsive grid behind both content indexes: a single column on mobile,
 * filling to as many ~300px columns as the viewport allows. This is deliberately
 * the only layout stories and projects share — the cards themselves differ, so
 * the two indexes read as distinct surfaces rather than one list of everything.
 */
export const ContentGrid = ({ children, className }: Props): JSX.Element => (
  <section
    className={cn(
      'grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]',
      className
    )}
  >
    {children}
  </section>
)
