'use client'

import { ChangeEvent, JSX, useRef, useState, useTransition } from 'react'
import { DownloadIcon, RefreshCwIcon, UploadIcon, XIcon } from 'lucide-react'
import { Button } from '@workspace/ui/components/custom/button'
import { toast } from '@workspace/ui/components/sonner'
import { cn } from '@workspace/ui/lib/utils'
import { Breadcrumbs } from './breadcrumbs'
import { FileTable } from './file-table'
import { FilePreview } from './file-preview'
import { DropZone } from './upload-dropzone'
import { NewFolderDialog } from './new-folder-dialog'
import { DeleteFilesDialog } from './delete-files-dialog'
import { StorageFile, StorageItem } from '@/interfaces/storage-item'
import {
  deleteFiles,
  getDownloadUrl,
  listFiles,
  uploadFiles,
} from '@/app/(dashboard)/files/actions'

interface Props {
  initialPath: string
  initialItems: StorageItem[]
}

export const FileManager = ({ initialPath, initialItems }: Props): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [path, setPath] = useState(initialPath)
  const [items, setItems] = useState(initialItems)
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set())
  const [preview, setPreview] = useState<StorageFile | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isUploading, startUpload] = useTransition()

  const selectedItems = items.filter((item) => selectedPaths.has(item.fullPath))
  const selectionHasFolder = selectedItems.some((item) => item.type === 'folder')

  const load = (nextPath: string): void => {
    setPreview(null)
    setSelectedPaths(new Set())
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
    else setPreview(item)
  }

  const toggle = (item: StorageItem): void =>
    setSelectedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(item.fullPath)) next.delete(item.fullPath)
      else next.add(item.fullPath)
      return next
    })

  const toggleAll = (checked: boolean): void =>
    setSelectedPaths(checked ? new Set(items.map((item) => item.fullPath)) : new Set())

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

  const download = (): void => {
    startTransition(async () => {
      for (const item of selectedItems) {
        if (item.type !== 'file') continue
        const result = await getDownloadUrl(item.fullPath)
        if (result.ok && result.url) {
          const anchor = document.createElement('a')
          anchor.href = result.url
          anchor.download = item.name
          anchor.rel = 'noreferrer'
          anchor.click()
        }
      }
    })
  }

  return (
    <div className="flex flex-col gap-4" data-testid="filesPage">
      <h1 className="text-2xl font-bold">Files</h1>

      {selectedPaths.size > 0 ? (
        <div
          className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 p-2"
          data-testid="fmSelectionToolbar"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedPaths(new Set())}
            aria-label="Clear selection"
          >
            <XIcon />
          </Button>
          <span className="text-sm font-medium">{selectedPaths.size} selected</span>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={download}
              disabled={selectionHasFolder}
              loading={isPending}
              data-testid="fmDownload"
            >
              <DownloadIcon />
              Download
            </Button>
            <DeleteFilesDialog
              count={selectedItems.length}
              onConfirm={() => deleteFiles(selectedItems)}
              onDeleted={() => load(path)}
            />
          </div>
        </div>
      ) : (
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
      )}

      <p className="text-xs text-muted-foreground">
        Drag and drop files anywhere below to upload, or use the Upload button.
      </p>

      <DropZone onFiles={upload} disabled={isUploading}>
        <div className={cn('grid gap-4', preview && 'lg:grid-cols-[1fr_20rem]')}>
          <div className={cn(isPending && 'opacity-60 transition-opacity')}>
            <FileTable
              items={items}
              onOpen={open}
              selectedPath={preview?.fullPath}
              selectedPaths={selectedPaths}
              onToggle={toggle}
              onToggleAll={toggleAll}
              onUploadClick={() => inputRef.current?.click()}
            />
          </div>
          {preview && (
            <FilePreview file={preview} onClose={() => setPreview(null)} />
          )}
        </div>
      </DropZone>
    </div>
  )
}
