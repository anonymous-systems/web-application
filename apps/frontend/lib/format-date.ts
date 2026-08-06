/**
 * Renders an ISO timestamp as `Sep 1, 2023` for card and detail metadata, or
 * null when absent — migrated documents can lack `publishedAt` entirely, and
 * callers omit the element rather than printing a placeholder date.
 */
export const formatDate = (iso: string | null): string | null => {
  if (!iso) return null

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
