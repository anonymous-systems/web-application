'use client'

import { ComponentProps, JSX } from 'react'
import {
  ToggleGroup as BaseToggleGroup,
  ToggleGroupItem as BaseToggleGroupItem,
} from '../toggle-group'
import { cn } from '../../lib/utils'

type GroupProps = ComponentProps<typeof BaseToggleGroup>
type ItemProps = ComponentProps<typeof BaseToggleGroupItem>

/**
 * Anonymous Systems filter chips: the pristine shadcn toggle group rendered as
 * separated pills rather than a joined segmented control, matching the chip row
 * in the Figma list frames. `spacing` defaults to 2 so the items round
 * individually instead of collapsing into one bar.
 */
const ToggleGroup = ({ className, spacing = 2, ...props }: GroupProps): JSX.Element => {
  return (
    <BaseToggleGroup
      spacing={spacing}
      className={cn('flex-wrap', className)}
      {...props}
    />
  )
}

const ToggleGroupItem = ({ className, ...props }: ItemProps): JSX.Element => {
  return (
    <BaseToggleGroupItem
      className={cn('cursor-pointer rounded-[100px] border', className)}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
