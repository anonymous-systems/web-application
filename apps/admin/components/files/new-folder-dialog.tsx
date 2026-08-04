'use client'

import { FormEvent, JSX, useState, useTransition } from 'react'
import { FolderPlusIcon } from 'lucide-react'
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
import { createFolder } from '@/app/(dashboard)/files/actions'

interface Props {
  path: string
  onCreated: () => void
}

export const NewFolderDialog = ({ path, onCreated }: Props): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [isPending, startTransition] = useTransition()

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    startTransition(async () => {
      const result = await createFolder(path, name)
      if (!result.ok) {
        toast.error(result.error ?? 'Something went wrong.')
        return
      }
      toast.success('Folder created.')
      setOpen(false)
      onCreated()
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setName('')
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" data-testid="fmNewFolder">
          <FolderPlusIcon />
          New folder
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="newFolderDialog">
        <DialogHeader>
          <DialogTitle>New folder</DialogTitle>
          <DialogDescription>
            Creates a folder in the current directory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="folder-name">Name</Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="documents"
              data-testid="folderNameInput"
            />
          </div>
          <DialogFooter>
            <Button type="submit" loading={isPending} data-testid="folderSubmit">
              Create folder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
