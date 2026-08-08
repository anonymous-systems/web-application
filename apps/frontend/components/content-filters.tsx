'use client'

import { JSX, useOptimistic, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'
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
  const [navigating, startNavigation] = useTransition()

  /*
   * The chips are driven by `value`, which is resolved on the server — so until
   * the new page arrived nothing moved, and a click looked like it had been
   * ignored for the second or two the navigation took. The optimistic value
   * lights the pressed chip at once and is dropped when the real one lands.
   */
  const [selected, select] = useOptimistic(value)

  // Radix clears the value to '' when the active item is pressed again; that and
  // ALL_FILTER both mean "no filter", so both drop the query parameter.
  const onChange = (next: string): void => {
    const filtered = next && next !== ALL_FILTER

    startNavigation(() => {
      select(filtered ? next : ALL_FILTER)
      router.push(filtered ? `${basePath}?${paramName}=${next}` : basePath)
    })
  }

  return (
    <ToggleGroup
      type="single"
      value={selected}
      onValueChange={onChange}
      aria-label="Filter"
      // Dimming the row says the click landed and results are on the way, which
      // the chip alone cannot: it looks identical whether the page has arrived.
      aria-busy={navigating}
      className={cn('transition-opacity', navigating && 'opacity-60')}
    >
      {options.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value}>
          {selected === option.value && <Check className="size-3" aria-hidden />}
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
