// Controlled vocabulary for comment reactions. The runtime array feeds the rules
// specs and the UI; the union type is derived from it so the allowed values are
// defined exactly once.

export const REACTION_TYPES = ['like', 'dislike'] as const
export type ReactionType = (typeof REACTION_TYPES)[number]
