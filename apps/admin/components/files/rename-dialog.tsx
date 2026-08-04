'use client'

import { FormEvent, JSX, useState, useTransition } from 'react'
import { PencilIcon } from 'lucide-react'
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
import { renameFile } from '@/app/(dashboard)/files/actions'

interface Props {
  item: StorageItem
  onRenamed: () => void
}

export const RenameDialog = ({ item, onRenamed }: Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(item.name)
  const [isPending, startTransition] = useTransition()

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    startTransition(async () => {
      const result = await renameFile(item, name)
      if (!result.ok) {
        toast.error(result.error ?? 'Something went wrong.')
        return
      }
      toast.success('Renamed.')
      setOpen(false)
      onRenamed()
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setName(item.name)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="fmRename">
          <PencilIcon />
          Rename
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="renameDialog">
        <DialogHeader>
          <DialogTitle>Rename {item.type}</DialogTitle>
          <DialogDescription>
            Renaming a folder also moves everything inside it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="rename-input">Name</Label>
            <Input
              id="rename-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              data-testid="renameInput"
            />
          </div>
          <DialogFooter>
            <Button type="submit" loading={isPending} data-testid="renameSubmit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
