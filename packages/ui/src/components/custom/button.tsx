'use client'

import { ComponentProps, JSX } from 'react'
import { Button as BaseButton, buttonVariants } from '../button'
import { cn } from '../../lib/utils'

type Props = ComponentProps<typeof BaseButton> & { loading?: boolean }

/**
 * Anonymous Systems button: the pristine shadcn button with our house style
 * (pill shape, pointer cursor) and a `loading` prop that disables the button.
 * Keeping these here leaves `components/button.tsx` pristine and updatable.
 */
const Button = ({
  className,
  loading = false,
  disabled = false,
  ...props
}: Props): JSX.Element => {
  return (
    <BaseButton
      className={cn('cursor-pointer rounded-[100px]', className)}
      disabled={disabled || loading}
      {...props}
    />
  )
}

export { Button, buttonVariants }
