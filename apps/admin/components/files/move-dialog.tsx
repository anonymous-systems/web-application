'use client'

import { FormEvent, JSX, useState, useTransition } from 'react'
import { FolderInputIcon } from 'lucide-react'
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
import { StorageItem } from '@/interfaces/storage-item'
import { moveFiles } from '@/app/(dashboard)/files/actions'

interface Props {
  items: StorageItem[]
  onMoved: () => void
}

export const MoveDialog = ({ items, onMoved }: Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [dest, setDest] = useState('')
  const [isPending, startTransition] = useTransition()
  const noun = items.length === 1 ? 'item' : 'items'

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    startTransition(async () => {
      const result = await moveFiles(items, dest)
      if (!result.ok) {
        toast.error(result.error ?? 'Something went wrong.')
        return
      }
      toast.success(`Moved ${items.length} ${noun}.`)
      setOpen(false)
      onMoved()
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setDest('')
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="fmMove">
          <FolderInputIcon />
          Move
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="moveDialog">
        <DialogHeader>
          <DialogTitle>
            Move {items.length} {noun}
          </DialogTitle>
          <DialogDescription>
            Enter the destination folder path. Leave blank to move to the root.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="move-input">Destination folder</Label>
            <Input
              id="move-input"
              value={dest}
              onChange={(event) => setDest(event.target.value)}
              placeholder="documents/archive"
              data-testid="moveInput"
            />
          </div>
          <DialogFooter>
            <Button type="submit" loading={isPending} data-testid="moveSubmit">
              Move
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
