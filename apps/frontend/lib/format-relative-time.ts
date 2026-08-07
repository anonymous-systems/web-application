const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7
const MONTH = DAY * 30
const YEAR = DAY * 365

const UNITS: [threshold: number, seconds: number, unit: Intl.RelativeTimeFormatUnit][] = [
  [MINUTE, 1, 'second'],
  [HOUR, MINUTE, 'minute'],
  [DAY, HOUR, 'hour'],
  [WEEK, DAY, 'day'],
  [MONTH, WEEK, 'week'],
  [YEAR, MONTH, 'month'],
  [Infinity, YEAR, 'year'],
]

const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

/**
 * An ISO timestamp as "3 days ago", for comment bylines. Returns null when the
 * timestamp is missing or unparseable so callers omit the element rather than
 * printing a placeholder — comments written before `createdAt` was stamped, and
 * the brief window before a server timestamp resolves, both hit this.
 *
 * `now` is injectable so the thresholds can be tested without freezing time.
 */
export const formatRelativeTime = (
  iso: string | null,
  now: Date = new Date()
): string | null => {
  if (!iso) return null

  const then = new Date(iso)
  if (Number.isNaN(then.getTime())) return null

  const elapsed = Math.round((now.getTime() - then.getTime()) / 1000)
  // A server timestamp can land a moment ahead of the reader's clock; treat any
  // near-zero difference as "now" rather than saying "in 2 seconds".
  if (Math.abs(elapsed) < MINUTE) return formatter.format(0, 'second')

  const match = UNITS.find(([threshold]) => Math.abs(elapsed) < threshold)
  if (!match) return null

  const [, seconds, unit] = match
  return formatter.format(-Math.round(elapsed / seconds), unit)
}
