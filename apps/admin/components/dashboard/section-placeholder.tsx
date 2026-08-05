import { JSX } from 'react'

interface Props {
  title: string
  description?: string
}

/**
 * Placeholder body for admin sections that aren't built yet. Replaced by the
 * real management UI as each section is implemented.
 */
export const SectionPlaceholder = ({ title, description }: Props): JSX.Element => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">
        {description ?? 'This section is coming soon.'}
      </p>
    </div>
  )
}
