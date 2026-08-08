'use client'

import { JSX, useMemo, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Label } from '@workspace/ui/components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { initialsFrom } from '@workspace/ui/lib/initials'
import {
  COMMENT_SORT_LABELS,
  COMMENT_SORTS,
  CommentSort,
  DEFAULT_COMMENT_SORT,
} from '@workspace/ui/models/comment-constants'
import { Comment } from '@workspace/ui/models/interfaces/comment'
import { CommentReactions } from '@/components/comment-reactions'
import { CommentReportDialog } from '@/components/comment-report-dialog'
import { CommentParentType } from '@/lib/comment-parents'
import { compareComments } from '@/lib/comment-sort'

export interface CommentRowModel {
  comment: Comment
  /**
   * Formatted on the server. Relative time read from the client would be
   * computed against a different clock than the one that rendered the markup,
   * so a comment near a unit boundary would hydrate to different words.
   */
  posted: string | null
}

interface Props {
  rows: CommentRowModel[]
  parentType: CommentParentType
  parentId: string
}

const CommentRow = ({
  comment,
  posted,
  parentType,
  parentId,
}: CommentRowModel & {
  parentType: CommentParentType
  parentId: string
}): JSX.Element => (
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
        {posted && <span className="text-muted-foreground text-xs">{posted}</span>}
      </div>

      <p className="text-sm whitespace-pre-line">{comment.content}</p>

      <div className="flex items-center gap-1">
        <CommentReactions
          comment={comment}
          parentType={parentType}
          parentId={parentId}
        />
        <CommentReportDialog
          commentId={comment.id}
          parentType={parentType}
          parentId={parentId}
          reported={comment.viewerReported}
        />
      </div>
    </div>
  </li>
)

/**
 * The thread, with the reader's choice of order.
 *
 * Ordering is the only reason this is a client component: the whole thread has
 * already been fetched, so re-ordering is local and instant, where routing the
 * choice through the URL would reload the page to rearrange data it already has.
 *
 * The control is hidden below two comments, where every order is the same list.
 */
export const CommentsList = ({
  rows,
  parentType,
  parentId,
}: Props): JSX.Element => {
  const [sort, setSort] = useState<CommentSort>(DEFAULT_COMMENT_SORT)

  const sorted = useMemo(
    () => [...rows].sort((a, b) => compareComments(sort)(a.comment, b.comment)),
    [rows, sort]
  )

  return (
    <div className="flex flex-col gap-4">
      {rows.length > 1 && (
        <div className="flex items-center gap-2">
          <Label htmlFor="comment-sort" className="text-muted-foreground text-xs">
            Sort by
          </Label>
          <Select
            value={sort}
            onValueChange={(next) => setSort(next as CommentSort)}
          >
            <SelectTrigger
              id="comment-sort"
              size="sm"
              className="w-auto"
              data-testid="commentSort"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMMENT_SORTS.map((value) => (
                <SelectItem key={value} value={value} data-value={value}>
                  {COMMENT_SORT_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <ul className="flex flex-col gap-4" data-testid="commentsThread">
        {sorted.map((row) => (
          <CommentRow
            key={row.comment.id}
            {...row}
            parentType={parentType}
            parentId={parentId}
          />
        ))}
      </ul>
    </div>
  )
}
