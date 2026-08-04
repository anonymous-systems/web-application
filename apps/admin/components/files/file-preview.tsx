'use client'

import { JSX, useEffect, useState } from 'react'
import { CopyIcon, DownloadIcon, XIcon } from 'lucide-react'
import { Button } from '@workspace/ui/components/custom/button'
import { toast } from '@workspace/ui/components/sonner'
import { StorageItemIcon } from './storage-item-icon'
import { formatBytes } from '@/lib/format-bytes'
import { StorageFile } from '@/interfaces/storage-item'
import { getDownloadUrl } from '@/app/(dashboard)/files/actions'

interface Props {
  file: StorageFile
  onClose: () => void
}

const dateLabel = (iso: string | null): string =>
  iso ? new Date(iso).toLocaleString() : '—'

export const FilePreview = ({ file, onClose }: Props): JSX.Element => {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setUrl(null)
    void getDownloadUrl(file.fullPath).then((result) => {
      if (active && result.ok && result.url) setUrl(result.url)
    })
    return () => {
      active = false
    }
  }, [file.fullPath])

  const copyLink = (): void => {
    if (!url) return
    void navigator.clipboard
      .writeText(url)
      .then(() => toast.success('Link copied.'))
  }

  const isImage = file.contentType?.startsWith('image/')
  const isVideo = file.contentType?.startsWith('video/')

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

      {url && isImage && (
        // eslint-disable-next-line @next/next/no-img-element -- dynamic storage object
        <img
          src={url}
          alt={file.name}
          className="max-h-64 w-full rounded-md border object-contain"
          data-testid="previewImage"
        />
      )}
      {url && isVideo && (
        <video
          src={url}
          controls
          className="max-h-64 w-full rounded-md border"
          data-testid="previewVideo"
        />
      )}

      <div className="flex flex-wrap gap-2">
        {url ? (
          <Button asChild variant="outline" size="sm">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              download={file.name}
              data-testid="previewDownload"
            >
              <DownloadIcon />
              Download
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <DownloadIcon />
            Download
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={copyLink}
          disabled={!url}
          data-testid="previewCopy"
        >
          <CopyIcon />
          Copy link
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
