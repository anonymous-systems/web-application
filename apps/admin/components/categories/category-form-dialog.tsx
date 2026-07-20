'use client'

import { FormEvent, JSX, ReactNode, useState, useTransition } from 'react'
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
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { toast } from '@workspace/ui/components/sonner'
import { createCategory, updateCategory } from '@/app/(dashboard)/categories/actions'
import { Category } from '@/interfaces/category'

interface Props {
  /** Present when editing; omitted when creating. */
  category?: Category
  trigger: ReactNode
}

export const CategoryFormDialog = ({ category, trigger }: Props): JSX.Element => {
  const isEdit = category != null
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(category?.name ?? '')
  const [description, setDescription] = useState(category?.description ?? '')
  const [isPending, startTransition] = useTransition()

  // Reset to the current values each time the dialog opens so a cancelled edit
  // doesn't leak into the next one.
  const handleOpenChange = (next: boolean): void => {
    setOpen(next)
    if (next) {
      setName(category?.name ?? '')
      setDescription(category?.description ?? '')
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    startTransition(async () => {
      const result = isEdit
        ? await updateCategory(category.id, name, description)
        : await createCategory(name, description)

      if (!result.ok) {
        toast.error(result.error ?? 'Something went wrong.')
        return
      }

      toast.success(isEdit ? 'Category updated.' : 'Category created.')
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent data-testid="categoryFormDialog">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit category' : 'New category'}</DialogTitle>
          <DialogDescription>
            The slug is generated from the name and is used in public URLs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Web Development"
              data-testid="categoryNameInput"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="category-description">Description</Label>
            <Input
              id="category-description"
              value={description ?? ''}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional"
              data-testid="categoryDescriptionInput"
            />
          </div>

          <DialogFooter>
            <Button type="submit" loading={isPending} data-testid="categorySubmit">
              {isEdit ? 'Save changes' : 'Create category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
