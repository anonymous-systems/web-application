'use client'

import { JSX } from 'react'
import { Label } from '@workspace/ui/components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'

export interface SelectOption {
  value: string
  label: string
}

interface Props {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  /** Adds a leading option (e.g. "No category") whose selection maps to `''`. */
  noneLabel?: string
  testId?: string
}

// Radix Select forbids an empty-string item value, so the optional "none" option
// uses a sentinel that maps back to '' at the component boundary.
const NONE = '__none__'

export const SelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  noneLabel,
  testId,
}: Props): JSX.Element => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={id}>{label}</Label>
    <Select
      value={value === '' ? NONE : value}
      onValueChange={(next) => onChange(next === NONE ? '' : next)}
    >
      <SelectTrigger id={id} className="w-full" data-testid={testId}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {noneLabel !== undefined && (
          <SelectItem value={NONE}>{noneLabel}</SelectItem>
        )}
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            data-value={option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)
