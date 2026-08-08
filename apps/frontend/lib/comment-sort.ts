import { CommentSort } from '@workspace/ui/models/comment-constants'
import { Comment } from '@workspace/ui/models/interfaces/comment'

/** The only fields an order depends on, so the tests need no whole comment. */
export type SortableComment = Pick<Comment, 'createdAt' | 'likeCount'>

// Comments predating the `createdAt` stamp sort as the empty string rather than
// being dropped, which keeps them visible — at one end or the other — instead of
// vanishing from a thread the way `orderBy` would have removed them.
const posted = (comment: SortableComment): string => comment.createdAt ?? ''

/**
 * A comparator for one thread order.
 *
 * Sorting happens in the browser because the whole thread is already loaded:
 * re-ordering it costs nothing and needs no round trip, so the list reorders on
 * the click rather than after a navigation.
 *
 * `top` falls back to newest within equal scores. Ties are common — most
 * comments have no likes at all — and without a second key their relative order
 * would depend on however the documents happened to arrive.
 */
export const compareComments = (
  sort: CommentSort
): ((a: SortableComment, b: SortableComment) => number) => {
  if (sort === 'oldest') {
    return (a, b) => posted(a).localeCompare(posted(b))
  }

  if (sort === 'newest') {
    return (a, b) => posted(b).localeCompare(posted(a))
  }

  return (a, b) =>
    b.likeCount - a.likeCount || posted(b).localeCompare(posted(a))
}
