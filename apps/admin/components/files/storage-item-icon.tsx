import { JSX } from 'react'
import {
  FileArchiveIcon,
  FileAudioIcon,
  FileCodeIcon,
  FileIcon,
  FileImageIcon,
  FileTextIcon,
  FileVideoIcon,
  FolderIcon,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'

const iconForContentType = (contentType: string | null): LucideIcon => {
  if (!contentType) return FileIcon
  if (contentType.startsWith('image/')) return FileImageIcon
  if (contentType.startsWith('video/')) return FileVideoIcon
  if (contentType.startsWith('audio/')) return FileAudioIcon
  if (contentType.startsWith('text/')) return FileTextIcon
  if (/zip|tar|compressed|rar|7z/.test(contentType)) return FileArchiveIcon
  if (/json|javascript|xml|html|css/.test(contentType)) return FileCodeIcon
  return FileIcon
}

interface Props {
  type: 'file' | 'folder'
  contentType?: string | null
  className?: string
}

export const StorageItemIcon = ({
  type,
  contentType,
  className,
}: Props): JSX.Element => {
  const Icon = type === 'folder' ? FolderIcon : iconForContentType(contentType ?? null)

  return (
    <Icon
      className={cn(
        'size-4 shrink-0',
        type === 'folder' ? 'text-primary' : 'text-muted-foreground',
        className
      )}
    />
  )
}
