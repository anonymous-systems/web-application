import { ReactionType } from '@workspace/ui/models/comment-constants'

/** A comment's reaction state as the server last reported it. */
export interface ReactionSnapshot {
  reaction: ReactionType | null
  likeCount: number
  dislikeCount: number
}

export interface DisplayedReactions {
  likes: number
  dislikes: number
}

/**
 * The counts to show, given what the server reported and what the viewer has
 * pressed since.
 *
 * `snapshot` must be what the server said **before** the viewer reacted, and
 * must not be re-read afterwards. The counts are denormalised onto the comment
 * by a Firestore trigger that runs *after* the reaction document is written, so
 * for a moment the comment carries the viewer's new `viewerReaction` alongside
 * counts that still exclude it. Measuring the delta against that half-updated
 * document reports no change at all — which is what made a count sit on the old
 * number until the page was reloaded.
 *
 * Holding the snapshot still also keeps the arithmetic non-negative: a -1 is
 * only ever applied when the snapshot counted this viewer in the first place.
 */
export const displayedReactions = (
  snapshot: ReactionSnapshot,
  reaction: ReactionType | null
): DisplayedReactions => {
  const offset = (type: ReactionType): number => {
    const had = snapshot.reaction === type
    const has = reaction === type
    if (had === has) return 0

    return has ? 1 : -1
  }

  return {
    likes: snapshot.likeCount + offset('like'),
    dislikes: snapshot.dislikeCount + offset('dislike'),
  }
}
