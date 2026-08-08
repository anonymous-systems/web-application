import { JSX } from 'react'
import { cookies, headers } from 'next/headers'
import { getTokens } from 'next-firebase-auth-edge'
import { Divider } from '@workspace/ui/components/divider'
import { authConfig } from '@workspace/firebase-config/auth'
import { Comment } from '@workspace/ui/models/interfaces/comment'
import { formatRelativeTime } from '@/lib/format-relative-time'
import { CommentForm } from '@/components/comment-form'
import { CommentsList } from '@/components/comments-list'
import { CommentParentType } from '@/lib/comment-parents'
import { listComments } from '@/services/comment-service'

interface Props {
  parentType: CommentParentType
  parentId: string
  allowComments: boolean
}

/**
 * The comment thread under a story or project.
 *
 * When the author disabled comments the section stays and says so, rather than
 * disappearing: absence is ambiguous — a reader cannot tell a closed thread from
 * one that failed to load — whereas the notice is unmistakable. No fetch is made
 * in that case, and the rules would reject it anyway.
 */
export const CommentsSection = async ({
  parentType,
  parentId,
  allowComments,
}: Props): Promise<JSX.Element> => {
  if (!allowComments) {
    return (
      <section className="flex flex-col gap-4" data-testid="commentsSection">
        <Divider />
        <p className="text-muted-foreground text-sm" data-testid="commentsDisabled">
          Comments are turned off.
        </p>
      </section>
    )
  }

  // Resolved here rather than passed from the page: the viewer's reactions are
  // part of reading the thread, and every caller would otherwise repeat this.
  const tokens = await getTokens(await cookies(), {
    ...authConfig,
    headers: await headers(),
  })

  // The thread is secondary to the content it hangs off, so a failure says so
  // and leaves the article readable rather than throwing out of the server
  // component and taking the page with it.
  let comments: Comment[]
  try {
    comments = await listComments(
      parentType,
      parentId,
      tokens
        ? { uid: tokens.decodedToken.uid, idToken: tokens.token }
        : undefined
    )
  } catch (error) {
    console.error('Failed to load comments', { parentType, parentId, error })

    return (
      <section className="flex flex-col gap-4" data-testid="commentsSection">
        <Divider />
        <p
          className="text-muted-foreground text-sm"
          data-testid="commentsUnavailable"
        >
          Comments couldn’t be loaded right now.
        </p>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-4" data-testid="commentsSection">
      <Divider />

      <h2 className="text-lg font-semibold">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h2>

      <CommentForm parentType={parentType} parentId={parentId} />

      {comments.length > 0 && (
        <CommentsList
          // Timestamps are formatted here, on the server, so the list can be a
          // client component without the relative time drifting on hydration.
          rows={comments.map((comment) => ({
            comment,
            posted: formatRelativeTime(comment.createdAt),
          }))}
          parentType={parentType}
          parentId={parentId}
        />
      )}
    </section>
  )
}
