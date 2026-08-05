const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const

/** Human-readable file size, e.g. 1536 → "1.5 KB". */
export const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    UNITS.length - 1
  )
  const value = bytes / 1024 ** exponent
  const rounded = exponent === 0 ? value : Math.round(value * 10) / 10

  return `${rounded} ${UNITS[exponent]}`
}
