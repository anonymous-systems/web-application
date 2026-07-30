'use client'

import { JSX, useState, useTransition } from 'react'
import { Trash2Icon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog'
import { Button } from '@workspace/ui/components/custom/button'
import { toast } from '@workspace/ui/components/sonner'
import { ActionResult } from '@/interfaces/action-result'

interface Props {
  storyId: string
  commentId: string
  /** Author label, used only for the confirm copy and accessible name. */
  author: string
  deleteAction: (storyId: string, commentId: string) => Promise<ActionResult>
}

/** Destructive confirm for removing a user comment during moderation. */
export const DeleteCommentDialog = ({
  storyId,
  commentId,
  author,
  deleteAction,
}: Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (): void => {
    startTransition(async () => {
      const result = await deleteAction(storyId, commentId)

      if (!result.ok) {
        toast.error(result.error ?? 'Something went wrong.')
        return
      }

      toast.success('Comment deleted.')
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete comment by ${author}`}
          data-testid="deleteCommentTrigger"
        >
          <Trash2Icon />
        </Button>
      </DialogTrigger>

      <DialogContent data-testid="deleteCommentDialog">
        <DialogHeader>
          <DialogTitle>Delete comment</DialogTitle>
          <DialogDescription>
            This comment by {author} will be permanently removed. This can’t be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            loading={isPending}
            onClick={handleDelete}
            data-testid="confirmDeleteComment"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
