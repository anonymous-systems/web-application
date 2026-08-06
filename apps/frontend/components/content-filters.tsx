'use client'

import { JSX } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@workspace/ui/components/custom/toggle-group'

export interface FilterOption {
  /** Query-string value; the all-items option uses an empty string. */
  value: string
  label: string
}

interface Props {
  options: FilterOption[]
  /** The active option's value, resolved on the server from the URL. */
  value: string
  /** Route the chips navigate within, e.g. `/stories`. */
  basePath: string
  paramName: string
}

/**
 * Filter chips for the content indexes. State lives in the URL rather than in
 * the component so the filtered view is shareable and the page stays a server
 * component — this only handles the navigation.
 */
export const ContentFilters = ({
  options,
  value,
  basePath,
  paramName,
}: Props): JSX.Element => {
  const router = useRouter()

  // Radix clears the value when the active item is pressed again; treat that as
  // a reset to "all" rather than navigating to an empty filter.
  const onChange = (next: string): void => {
    router.push(next ? `${basePath}?${paramName}=${next}` : basePath)
  }

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={onChange}
      aria-label="Filter"
    >
      {options.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value}>
          {value === option.value && <Check className="size-3" aria-hidden />}
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
