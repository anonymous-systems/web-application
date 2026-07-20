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
import { TaxonomyTerm } from '@/interfaces/taxonomy'
import { ActionResult } from '@/interfaces/action-result'

interface Props {
  /** Present when editing; omitted when creating. */
  term?: TaxonomyTerm
  trigger: ReactNode
  /** Lower-case singular noun, e.g. "category" or "tag". */
  singular: string
  createAction: (name: string, description: string) => Promise<ActionResult>
  updateAction: (
    id: string,
    name: string,
    description: string
  ) => Promise<ActionResult>
}

/**
 * Create/edit dialog shared by the taxonomy sections (categories, tags). The
 * owning section supplies its own server actions and label.
 */
export const TaxonomyFormDialog = ({
  term,
  trigger,
  singular,
  createAction,
  updateAction,
}: Props): JSX.Element => {
  const isEdit = term != null
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(term?.name ?? '')
  const [description, setDescription] = useState(term?.description ?? '')
  const [isPending, startTransition] = useTransition()

  // Reset to the current values each time the dialog opens so a cancelled edit
  // doesn't leak into the next one.
  const handleOpenChange = (next: boolean): void => {
    setOpen(next)
    if (next) {
      setName(term?.name ?? '')
      setDescription(term?.description ?? '')
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    startTransition(async () => {
      const result = isEdit
        ? await updateAction(term.id, name, description)
        : await createAction(name, description)

      if (!result.ok) {
        toast.error(result.error ?? 'Something went wrong.')
        return
      }

      toast.success(isEdit ? `${singular} updated.` : `${singular} created.`)
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent data-testid="termFormDialog">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Edit ${singular}` : `New ${singular}`}
          </DialogTitle>
          <DialogDescription>
            The slug is generated from the name and is used in public URLs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="term-name">Name</Label>
            <Input
              id="term-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Web Development"
              data-testid="termNameInput"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="term-description">Description</Label>
            <Input
              id="term-description"
              value={description ?? ''}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional"
              data-testid="termDescriptionInput"
            />
          </div>

          <DialogFooter>
            <Button type="submit" loading={isPending} data-testid="termSubmit">
              {isEdit ? 'Save changes' : `Create ${singular}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
