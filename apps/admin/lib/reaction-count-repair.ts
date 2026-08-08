import { REACTION_TYPES, ReactionType } from '@workspace/ui/models/comment-constants'

export interface ReactionTotals {
  likeCount: number
  dislikeCount: number
}

export interface CountRepair {
  /** False when the stored totals already match the reactions. */
  changed: boolean
  stored: ReactionTotals
  actual: ReactionTotals
}

const FIELD_FOR: Record<ReactionType, keyof ReactionTotals> = {
  like: 'likeCount',
  dislike: 'dislikeCount',
}

const isReactionType = (value: unknown): value is ReactionType =>
  REACTION_TYPES.includes(value as ReactionType)

/**
 * The totals a comment *should* carry, counted from its reaction documents.
 *
 * The subcollection is the truth: one document per reactor, keyed by uid, so a
 * count of it cannot double-count or miss anyone. The denormalised fields are
 * derived, and derived data drifts — a trigger applying increments cannot
 * repair itself once it has missed an event.
 *
 * Pure, so the arithmetic is tested without Firestore.
 */
export const countReactions = (
  reactions: { type?: unknown }[]
): ReactionTotals => {
  const totals: ReactionTotals = { likeCount: 0, dislikeCount: 0 }

  for (const reaction of reactions) {
    // A reaction with an unrecognised type is ignored rather than guessed at;
    // the rules only permit `like` and `dislike`, so one means corrupt data.
    if (isReactionType(reaction.type)) totals[FIELD_FOR[reaction.type]] += 1
  }

  return totals
}

/** Compares stored totals against the counted ones. */
export const planCountRepair = (
  stored: { likeCount?: unknown; dislikeCount?: unknown },
  reactions: { type?: unknown }[]
): CountRepair => {
  const actual = countReactions(reactions)
  const current: ReactionTotals = {
    likeCount: (stored.likeCount as number | undefined) ?? 0,
    dislikeCount: (stored.dislikeCount as number | undefined) ?? 0,
  }

  return {
    changed:
      current.likeCount !== actual.likeCount ||
      current.dislikeCount !== actual.dislikeCount,
    stored: current,
    actual,
  }
}
