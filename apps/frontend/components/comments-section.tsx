import { JSX } from 'react'
import { cookies, headers } from 'next/headers'
import { getTokens } from 'next-firebase-auth-edge'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Divider } from '@workspace/ui/components/divider'
import { authConfig } from '@workspace/firebase-config/auth'
import { initialsFrom } from '@workspace/ui/lib/initials'
import { Comment } from '@workspace/ui/models/interfaces/comment'
import { formatRelativeTime } from '@/lib/format-relative-time'
import { CommentForm } from '@/components/comment-form'
import { CommentReactions } from '@/components/comment-reactions'
import { CommentParentType, listComments } from '@/services/comment-service'

interface Props {
  parentType: CommentParentType
  parentId: string
  allowComments: boolean
}

interface RowProps {
  comment: Comment
  parentType: CommentParentType
  parentId: string
}

const CommentRow = ({ comment, parentType, parentId }: RowProps): JSX.Element => {
  const posted = formatRelativeTime(comment.createdAt)

  return (
    <li className="flex items-start gap-3">
      <Avatar className="size-8 shrink-0">
        {comment.authorAvatar && <AvatarImage src={comment.authorAvatar} alt="" />}
        <AvatarFallback className="text-xs">
          {initialsFrom(comment.authorName)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-medium">
            {comment.authorName ?? 'Anonymous'}
          </span>
          {posted && (
            <span className="text-muted-foreground text-xs">{posted}</span>
          )}
        </div>

        <p className="text-sm whitespace-pre-line">{comment.content}</p>

        <CommentReactions
          comment={comment}
          parentType={parentType}
          parentId={parentId}
        />
      </div>
    </li>
  )
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

  const comments = await listComments(
    parentType,
    parentId,
    tokens?.decodedToken.uid
  )

  return (
    <section className="flex flex-col gap-4" data-testid="commentsSection">
      <Divider />

      <h2 className="text-lg font-semibold">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h2>

      <CommentForm parentType={parentType} parentId={parentId} />

      {comments.length > 0 && (
        <ul className="flex flex-col gap-4">
          {comments.map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
              parentType={parentType}
              parentId={parentId}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
