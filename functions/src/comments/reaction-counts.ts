/** Field deltas for a comment's denormalised reaction counts. */
export type CountDelta = Record<string, number>

const FIELD_FOR: Record<string, string> = {
  like: 'likeCount',
  dislike: 'dislikeCount',
}

/**
 * The count changes for one reaction transition, as increments rather than a
 * recount of the subcollection: increments are atomic, so two people reacting
 * at once cannot overwrite each other's total. A recount would also cost a
 * read of every reaction on every single click.
 *
 * Pure so the arithmetic is testable without the emulator.
 *
 * @param {string | null} before The reaction type before the write, or null
 *   when the document did not exist.
 * @param {string | null} after The reaction type after the write, or null when
 *   the document was deleted.
 * @return {CountDelta} Fields to increment, keyed by comment field name.
 */
export const countDelta = (
  before: string | null,
  after: string | null,
): CountDelta => {
  if (before === after) return {}

  const delta: CountDelta = {}

  const decrement = before ? FIELD_FOR[before] : undefined
  if (decrement) delta[decrement] = -1

  const increment = after ? FIELD_FOR[after] : undefined
  if (increment) delta[increment] = 1

  return delta
}
