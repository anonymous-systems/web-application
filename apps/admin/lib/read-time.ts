const WORDS_PER_MINUTE = 200

/**
 * Estimated reading time in whole minutes for story content (HTML in, tags
 * stripped). At least 1 for any non-empty content, 0 when empty.
 */
export const readTimeMinutes = (content: string | null): number => {
  if (!content) return 0

  const words = content
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return words === 0 ? 0 : Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}
