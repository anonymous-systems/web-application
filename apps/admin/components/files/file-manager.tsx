'use client'

import { ChangeEvent, JSX, useRef, useState, useTransition } from 'react'
import { RefreshCwIcon, UploadIcon } from 'lucide-react'
import { Button } from '@workspace/ui/components/custom/button'
import { toast } from '@workspace/ui/components/sonner'
import { cn } from '@workspace/ui/lib/utils'
import { Breadcrumbs } from './breadcrumbs'
import { FileTable } from './file-table'
import { FilePreview } from './file-preview'
import { DropZone } from './upload-dropzone'
import { NewFolderDialog } from './new-folder-dialog'
import { StorageFile, StorageItem } from '@/interfaces/storage-item'
import { listFiles, uploadFiles } from '@/app/(dashboard)/files/actions'

interface Props {
  initialPath: string
  initialItems: StorageItem[]
}

export const FileManager = ({ initialPath, initialItems }: Props): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [path, setPath] = useState(initialPath)
  const [items, setItems] = useState(initialItems)
  const [selected, setSelected] = useState<StorageFile | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isUploading, startUpload] = useTransition()

  const load = (nextPath: string): void => {
    setSelected(null)
    startTransition(async () => {
      const result = await listFiles(nextPath)
      if (!result.ok || !result.items) {
        toast.error(result.error ?? 'Something went wrong.')
        return
      }
      setPath(nextPath)
      setItems(result.items)
    })
  }

  const open = (item: StorageItem): void => {
    if (item.type === 'folder') load(item.fullPath)
    else setSelected(item)
  }

  const upload = (files: File[]): void => {
    if (files.length === 0) return
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    startUpload(async () => {
      const result = await uploadFiles(path, formData)
      if (!result.ok) {
        toast.error(result.error ?? 'Something went wrong.')
        return
      }
      toast.success(
        `Uploaded ${files.length} ${files.length === 1 ? 'file' : 'files'}.`
      )
      load(path)
    })
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = '' // allow re-selecting the same file
    upload(files)
  }

  return (
    <div className="flex flex-col gap-4" data-testid="filesPage">
      <h1 className="text-2xl font-bold">Files</h1>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border p-2">
        <Breadcrumbs path={path} onNavigate={load} />
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => load(path)}
            loading={isPending}
            aria-label="Refresh"
            data-testid="fmRefresh"
          >
            <RefreshCwIcon className={isPending ? 'animate-spin' : undefined} />
          </Button>
          <NewFolderDialog path={path} onCreated={() => load(path)} />
          <Button
            onClick={() => inputRef.current?.click()}
            loading={isUploading}
            data-testid="fmUpload"
          >
            <UploadIcon />
            Upload
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={onInputChange}
          data-testid="fmFileInput"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Drag and drop files anywhere below to upload, or use the Upload button.
      </p>

      <DropZone onFiles={upload} disabled={isUploading}>
        <div className={cn('grid gap-4', selected && 'lg:grid-cols-[1fr_20rem]')}>
          <div className={cn(isPending && 'opacity-60 transition-opacity')}>
            <FileTable
              items={items}
              onOpen={open}
              selectedPath={selected?.fullPath}
              onUploadClick={() => inputRef.current?.click()}
            />
          </div>
          {selected && (
            <FilePreview file={selected} onClose={() => setSelected(null)} />
          )}
        </div>
      </DropZone>
    </div>
  )
}
