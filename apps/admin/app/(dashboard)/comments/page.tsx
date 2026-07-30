import { JSX } from 'react'
import { MessageSquareIcon } from 'lucide-react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@workspace/ui/components/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar'
import { listComments } from '@/services/comment-service'
import { RefreshButton } from '@/components/dashboard/refresh-button'
import { DeleteCommentDialog } from '@/components/comments/delete-comment-dialog'
import { AdminComment } from '@/interfaces/comment'
import { deleteComment } from './actions'

const authorLabel = (comment: AdminComment): string =>
  comment.authorName ??
  (comment.authorUsername ? `@${comment.authorUsername}` : 'Unknown user')

const authorInitials = (comment: AdminComment): string => {
  const source = comment.authorName ?? comment.authorUsername
  if (!source) return '?'
  return source
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

// Falls back to the story id when the parent story has no title (or no longer
// exists), so a comment is always traceable to where it was left.
const storyLabel = (comment: AdminComment): string =>
  comment.storyTitle ?? comment.storyId

export default async function Page(): Promise<JSX.Element> {
  const comments = await listComments()

  return (
    <div className="flex flex-col gap-4" data-testid="commentsPage">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Comments</h1>
          <p className="text-muted-foreground" data-testid="commentsCount">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </p>
        </div>
        <RefreshButton />
      </div>

      <div className="rounded-lg border">
        <Table data-testid="commentsTable">
          <TableHeader>
            <TableRow>
              <TableHead>Comment</TableHead>
              <TableHead className="hidden md:table-cell">Story</TableHead>
              <TableHead className="hidden md:table-cell">Posted</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={4}>
                  <Empty data-testid="commentsEmpty">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <MessageSquareIcon />
                      </EmptyMedia>
                      <EmptyTitle>No comments yet</EmptyTitle>
                      <EmptyDescription>
                        Comments people leave on stories show up here for
                        moderation.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
            {comments.map((comment) => {
              const posted = comment.createdAt
                ? new Date(comment.createdAt).toLocaleDateString()
                : '—'

              return (
                <TableRow
                  key={`${comment.storyId}/${comment.id}`}
                  data-testid="commentRow"
                  data-comment-id={comment.id}
                >
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <Avatar className="mt-0.5 size-8 shrink-0">
                        {comment.authorAvatar && (
                          <AvatarImage src={comment.authorAvatar} alt="" />
                        )}
                        <AvatarFallback>
                          {authorInitials(comment)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-sm font-medium">
                          {authorLabel(comment)}
                        </span>
                        <p className="text-sm break-words whitespace-pre-line text-muted-foreground line-clamp-3">
                          {comment.content}
                        </p>
                        <span className="text-xs text-muted-foreground md:hidden">
                          {storyLabel(comment)} · {posted}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    <span className="block max-w-[16rem] truncate">
                      {storyLabel(comment)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap md:table-cell text-muted-foreground">
                    {posted}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <DeleteCommentDialog
                        storyId={comment.storyId}
                        commentId={comment.id}
                        author={authorLabel(comment)}
                        deleteAction={deleteComment}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
