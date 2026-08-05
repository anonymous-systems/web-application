'use client'

import { JSX, ReactNode, useState, useTransition } from 'react'
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
  /**
   * Capitalised entity name, used to build stable test ids
   * (`delete${entity}Trigger`, `delete${entity}Dialog`, `confirmDelete${entity}`).
   */
  entity: string
  title: string
  description: ReactNode
  /** Accessible name for the icon-only trigger. */
  triggerLabel: string
  /** Toast shown once the deletion succeeds. */
  successMessage: string
  /** Bind the row's ids ahead of time, e.g. `deleteThing.bind(null, id)`. */
  onConfirm: () => Promise<ActionResult>
}

/**
 * Destructive confirm shared by every section that deletes a row. Sections
 * differ only in copy, test-id entity, and which bound action runs on confirm.
 */
export const ConfirmDeleteDialog = ({
  entity,
  title,
  description,
  triggerLabel,
  successMessage,
  onConfirm,
}: Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (): void => {
    startTransition(async () => {
      const result = await onConfirm()

      if (!result.ok) {
        toast.error(result.error ?? 'Something went wrong.')
        return
      }

      toast.success(successMessage)
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={triggerLabel}
          data-testid={`delete${entity}Trigger`}
        >
          <Trash2Icon />
        </Button>
      </DialogTrigger>

      <DialogContent data-testid={`delete${entity}Dialog`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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
            data-testid={`confirmDelete${entity}`}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
