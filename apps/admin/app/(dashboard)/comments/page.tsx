import { JSX } from 'react'
import Link from 'next/link'
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
import { initialsFrom } from '@workspace/ui/lib/initials'
import { RefreshButton } from '@/components/dashboard/refresh-button'
import { ConfirmDeleteDialog } from '@/components/dashboard/confirm-delete-dialog'
import { DismissReportsButton } from '@/components/dashboard/dismiss-reports-button'
import { Badge } from '@workspace/ui/components/custom/badge'
import { AdminComment } from '@/interfaces/comment'
import { deleteComment } from './actions'

const authorLabel = (comment: AdminComment): string =>
  comment.authorName ??
  (comment.authorUsername ? `@${comment.authorUsername}` : 'Unknown user')

const authorInitials = (comment: AdminComment): string => {
  const source = comment.authorName ?? comment.authorUsername
  return source ? initialsFrom(source) : '?'
}

// Falls back to the parent id when the story/project has no title (or no longer
// exists), so a comment is always traceable to where it was left.
const parentLabel = (comment: AdminComment): string =>
  comment.parentTitle ?? comment.parentId

// Links to the parent's editor so a moderator can jump to the source.
const parentHref = (comment: AdminComment): string =>
  `/${comment.parentType === 'project' ? 'projects' : 'stories'}/${comment.parentId}/edit`

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
              <TableHead className="hidden md:table-cell">Source</TableHead>
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
                        Comments people leave on stories and projects show up
                        here for moderation.
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
                  key={`${comment.parentType}-${comment.parentId}/${comment.id}`}
                  data-testid="commentRow"
                  data-comment-id={comment.id}
                  data-parent-type={comment.parentType}
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
                        <span className="flex flex-wrap items-center gap-2 text-sm font-medium">
                          {authorLabel(comment)}
                          {comment.openReports > 0 && (
                            <Badge
                              variant="destructive"
                              data-testid="commentReports"
                            >
                              {comment.openReports}{' '}
                              {comment.openReports === 1 ? 'report' : 'reports'}
                            </Badge>
                          )}
                        </span>
                        <p className="text-sm break-words whitespace-pre-line text-muted-foreground line-clamp-3">
                          {comment.content}
                        </p>
                        <span className="text-xs text-muted-foreground md:hidden">
                          <span className="capitalize">{comment.parentType}</span>{' '}
                          · {parentLabel(comment)} · {posted}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    <Link
                      href={parentHref(comment)}
                      className="block max-w-[16rem] truncate hover:underline"
                    >
                      {parentLabel(comment)}
                    </Link>
                    <span className="text-xs capitalize">{comment.parentType}</span>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap md:table-cell text-muted-foreground">
                    {posted}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {comment.openReports > 0 && (
                        <DismissReportsButton
                          parentType={comment.parentType}
                          parentId={comment.parentId}
                          commentId={comment.id}
                        />
                      )}
                      <ConfirmDeleteDialog
                        entity="Comment"
                        title="Delete comment"
                        triggerLabel={`Delete comment by ${authorLabel(comment)}`}
                        description={
                          <>
                            This comment by {authorLabel(comment)} will be
                            permanently removed. This can’t be undone.
                          </>
                        }
                        successMessage="Comment deleted."
                        onConfirm={deleteComment.bind(
                          null,
                          comment.parentType,
                          comment.parentId,
                          comment.id
                        )}
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
