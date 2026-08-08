'use client'

import { JSX } from 'react'
import { Checkbox } from '@workspace/ui/components/checkbox'

interface Props {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  testId: string
}

/**
 * A checkbox with its label as one clickable target — the whole row toggles,
 * which a bare `<Checkbox>` beside loose text does not give you.
 */
export const CheckboxField = ({
  label,
  checked,
  onChange,
  testId,
}: Props): JSX.Element => (
  <label className="flex items-center gap-2 text-sm">
    <Checkbox
      checked={checked}
      onCheckedChange={(next) => onChange(next === true)}
      data-testid={testId}
    />
    {label}
  </label>
)
