'use client'

import { JSX } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@workspace/ui/components/custom/toggle-group'

/**
 * The unfiltered option. A real value rather than an empty string: Radix treats
 * `''` as "nothing selected" in a single-select group, which would make "All"
 * and "no selection" the same state. This maps to *no* query parameter.
 */
export const ALL_FILTER = 'all'

export interface FilterOption {
  /** Query-string value, or ALL_FILTER for the unfiltered option. */
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

  // Radix clears the value to '' when the active item is pressed again; that and
  // ALL_FILTER both mean "no filter", so both drop the query parameter.
  const onChange = (next: string): void => {
    const filtered = next && next !== ALL_FILTER
    router.push(filtered ? `${basePath}?${paramName}=${next}` : basePath)
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
