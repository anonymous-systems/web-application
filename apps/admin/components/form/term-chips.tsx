'use client'

import { JSX } from 'react'
import { Button } from '@workspace/ui/components/custom/button'
import { titleCase } from '@/lib/text'
import { TermOption } from '@/interfaces/term-option'

interface Props {
  terms: TermOption[]
  /** Selected term ids. */
  selected: string[]
  onToggle: (id: string) => void
  /** Plural collection name, used in the empty state: "tags", "technologies". */
  section: string
  groupTestId: string
  toggleTestId: string
}

/**
 * A row of selectable taxonomy chips, with an empty state that says where to
 * create the terms — a picker offering nothing is otherwise indistinguishable
 * from one that failed to load.
 */
export const TermChips = ({
  terms,
  selected,
  onToggle,
  section,
  groupTestId,
  toggleTestId,
}: Props): JSX.Element =>
  terms.length === 0 ? (
    <p className="text-muted-foreground text-sm">
      No {section} yet — create some in the {titleCase(section)} section.
    </p>
  ) : (
    <div className="flex flex-wrap gap-2" data-testid={groupTestId}>
      {terms.map((term) => {
        const isSelected = selected.includes(term.id)

        return (
          <Button
            key={term.id}
            type="button"
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggle(term.id)}
            data-testid={toggleTestId}
            data-slug={term.slug}
            data-selected={isSelected}
          >
            {term.name}
          </Button>
        )
      })}
    </div>
  )
