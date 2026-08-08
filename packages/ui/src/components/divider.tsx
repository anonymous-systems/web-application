import { JSX } from 'react'
import { cn } from '../lib/utils'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}
export const Divider = (props: Props): JSX.Element => {
  const { orientation = 'horizontal', className } = props
  const orientationClass = orientation === 'vertical'
    ? 'w-px h-full'
    : 'h-px w-full'

  return (
    <hr
      role='separator'
      aria-orientation={orientation}
      className={cn(
        'bg-muted-foreground rounded-xl border-none',
        orientationClass,
        className
      )}
    />

  )
}