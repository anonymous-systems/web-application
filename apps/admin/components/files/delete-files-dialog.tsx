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
  count: number
  onConfirm: () => Promise<ActionResult>
  onDeleted: () => void
}

export const DeleteFilesDialog = ({
  count,
  onConfirm,
  onDeleted,
}: Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const noun = count === 1 ? 'item' : 'items'

  const handleDelete = (): void => {
    startTransition(async () => {
      const result = await onConfirm()
      if (!result.ok) {
        toast.error(result.error ?? 'Something went wrong.')
        return
      }
      toast.success(`Deleted ${count} ${noun}.`)
      setOpen(false)
      onDeleted()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="fmDelete">
          <Trash2Icon />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="deleteFilesDialog">
        <DialogHeader>
          <DialogTitle>
            Delete {count} {noun}
          </DialogTitle>
          <DialogDescription>
            The selected items — folders include everything inside them — will be
            permanently removed. This can’t be undone.
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
            data-testid="confirmDeleteFiles"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
