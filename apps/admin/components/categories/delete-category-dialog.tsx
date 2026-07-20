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
import { deleteCategory } from '@/app/(dashboard)/categories/actions'
import { Category } from '@/interfaces/category'

interface Props {
  category: Category
}

export const DeleteCategoryDialog = ({ category }: Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (): void => {
    startTransition(async () => {
      const result = await deleteCategory(category.id)

      if (!result.ok) {
        toast.error(result.error ?? 'Something went wrong.')
        return
      }

      toast.success('Category deleted.')
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete ${category.name}`}
          data-testid="deleteCategoryTrigger"
        >
          <Trash2Icon />
        </Button>
      </DialogTrigger>

      <DialogContent data-testid="deleteCategoryDialog">
        <DialogHeader>
          <DialogTitle>Delete category</DialogTitle>
          <DialogDescription>
            “{category.name}” will be permanently removed. This can’t be undone.
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
            data-testid="confirmDeleteCategory"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
