'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from '@workspace/ui/lib/utils'
import { JSX } from 'react'

type Props = ComponentProps<typeof LabelPrimitive.Root>
const Label = (props: Props): JSX.Element => {
  const { className, ...restOfProps } = props
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      {...restOfProps}
    />
  )
}

export { Label }
