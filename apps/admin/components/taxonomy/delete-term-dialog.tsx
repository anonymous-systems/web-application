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
import { TaxonomyTerm } from '@/interfaces/taxonomy'
import { ActionResult } from '@/interfaces/action-result'

interface Props {
  term: TaxonomyTerm
  /** Lower-case singular noun, e.g. "category" or "tag". */
  singular: string
  deleteAction: (id: string) => Promise<ActionResult>
}

/** Destructive confirm shared by the taxonomy sections. */
export const DeleteTermDialog = ({
  term,
  singular,
  deleteAction,
}: Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (): void => {
    startTransition(async () => {
      const result = await deleteAction(term.id)

      if (!result.ok) {
        toast.error(result.error ?? 'Something went wrong.')
        return
      }

      toast.success(`${singular} deleted.`)
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete ${term.name}`}
          data-testid="deleteTermTrigger"
        >
          <Trash2Icon />
        </Button>
      </DialogTrigger>

      <DialogContent data-testid="deleteTermDialog">
        <DialogHeader>
          <DialogTitle>Delete {singular}</DialogTitle>
          <DialogDescription>
            “{term.name}” will be permanently removed. This can’t be undone.
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
            data-testid="confirmDeleteTerm"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
