/** Shared so taxonomy, stories, and the legacy-story migration slug identically. */
export const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * `slugify(value)` suffixed with `-2`, `-3`, … until it clears `taken`, since
 * slugs address content publicly. An unslugifiable title returns '' rather than a
 * bare suffix — a validation failure for the caller to surface.
 */
export const uniqueSlug = (value: string, taken: Iterable<string>): string => {
  const base = slugify(value)
  if (base === '') return base

  const used = new Set(taken)
  if (!used.has(base)) return base

  let suffix = 2
  while (used.has(`${base}-${suffix}`)) suffix += 1

  return `${base}-${suffix}`
}
