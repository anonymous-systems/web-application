import { JSX } from 'react'
import { cn } from '@workspace/ui/lib/utils'

interface Props {
  html: string
  className?: string
}

/**
 * Renders stored CKEditor markup as HTML. The single `dangerouslySetInnerHTML`
 * in the app, so the trust boundary is auditable in one grep.
 *
 * "Trusted" is the precondition, not a description: this is only safe while
 * authoring stays admin-only (middleware + `ensureAdmin`). `STORY_STATUSES`
 * already reserves `pending` for a creator-submission flow — that flow must
 * sanitise on write before it ships, or every story body becomes stored XSS.
 */
export const TrustedHtml = ({ html, className }: Props): JSX.Element => (
  <div
    className={cn('prose dark:prose-invert max-w-none', className)}
    dangerouslySetInnerHTML={{ __html: html }}
  />
)
