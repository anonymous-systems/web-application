import { JSX } from 'react'
import { XIcon } from 'lucide-react'
import { Button } from '@workspace/ui/components/custom/button'
import { StorageItemIcon } from './storage-item-icon'
import { formatBytes } from '@/lib/format-bytes'
import { StorageFile } from '@/interfaces/storage-item'

interface Props {
  file: StorageFile
  onClose: () => void
}

const dateLabel = (iso: string | null): string =>
  iso ? new Date(iso).toLocaleString() : '—'

export const FilePreview = ({ file, onClose }: Props): JSX.Element => {
  return (
    <aside
      className="flex flex-col gap-4 rounded-lg border p-4"
      data-testid="filePreview"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <StorageItemIcon type="file" contentType={file.contentType} />
          <span className="truncate font-medium" title={file.name}>
            {file.name}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close preview"
        >
          <XIcon />
        </Button>
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="text-muted-foreground">Size</dt>
        <dd>{formatBytes(file.size)}</dd>
        <dt className="text-muted-foreground">Type</dt>
        <dd className="truncate">{file.contentType ?? '—'}</dd>
        <dt className="text-muted-foreground">Created</dt>
        <dd>{dateLabel(file.createdAt)}</dd>
        <dt className="text-muted-foreground">Modified</dt>
        <dd>{dateLabel(file.updated)}</dd>
      </dl>
    </aside>
  )
}
