// Controlled vocabulary for comment reactions. The runtime array feeds the rules
// specs and the UI; the union type is derived from it so the allowed values are
// defined exactly once.

export const REACTION_TYPES = ['like', 'dislike'] as const
export type ReactionType = (typeof REACTION_TYPES)[number]

// The orders a reader can put a thread in. `oldest` leads because it is the
// default: a thread reads as a conversation, so the first reply belongs first.
export const COMMENT_SORTS = ['oldest', 'newest', 'top'] as const
export type CommentSort = (typeof COMMENT_SORTS)[number]

export const DEFAULT_COMMENT_SORT: CommentSort = 'oldest'

export const COMMENT_SORT_LABELS: Record<CommentSort, string> = {
  oldest: 'Oldest first',
  newest: 'Newest first',
  top: 'Top comments',
}
