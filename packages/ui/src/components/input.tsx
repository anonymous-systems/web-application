import { cn } from '../lib/utils'
import { ARIA_INVALID, FOCUS_RING } from '../lib/styles'
import { ComponentProps, JSX } from 'react'

type Props = ComponentProps<'input'>
const Input = (props: Props): JSX.Element => {
  const { className, type, ...restOfProps } = props

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none',
        'md:text-sm placeholder:text-muted-foreground dark:bg-input/30',
        'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'selection:bg-primary selection:text-primary-foreground',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        FOCUS_RING,
        ARIA_INVALID,
        className
      )}
      {...restOfProps}
    />
  )
}

export { Input }
