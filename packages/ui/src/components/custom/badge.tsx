import { ComponentProps, JSX } from 'react'
import { Badge as BaseBadge, badgeVariants } from '../badge'
import { cn } from '../../lib/utils'

type Props = ComponentProps<typeof BaseBadge>

/**
 * Anonymous Systems badge: the pristine shadcn badge with our house style
 * (pill shape, matching `custom/button`). Keeping these here leaves
 * `components/badge.tsx` pristine and updatable.
 */
const Badge = ({ className, ...props }: Props): JSX.Element => {
  return (
    <BaseBadge className={cn('rounded-[100px]', className)} {...props} />
  )
}

export { Badge, badgeVariants }
