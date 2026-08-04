import { JSX } from 'react'
import { FolderOpenIcon, UploadIcon } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@workspace/ui/components/empty'
import { Button } from '@workspace/ui/components/custom/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import { cn } from '@workspace/ui/lib/utils'
import { StorageItemIcon } from './storage-item-icon'
import { formatBytes } from '@/lib/format-bytes'
import { StorageItem } from '@/interfaces/storage-item'

interface Props {
  items: StorageItem[]
  onOpen: (item: StorageItem) => void
  selectedPath?: string | null
  onUploadClick?: () => void
}

export const FileTable = ({
  items,
  onOpen,
  selectedPath,
  onUploadClick,
}: Props): JSX.Element => {
  return (
    <div className="rounded-lg border">
      <Table data-testid="filesTable">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden sm:table-cell">Size</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="hidden lg:table-cell">Modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4}>
                <Empty data-testid="filesEmpty">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <FolderOpenIcon />
                    </EmptyMedia>
                    <EmptyTitle>This folder is empty</EmptyTitle>
                    <EmptyDescription>
                      Drag and drop files here, or use Upload to add files.
                    </EmptyDescription>
                  </EmptyHeader>
                  {onUploadClick && (
                    <EmptyContent>
                      <Button onClick={onUploadClick} data-testid="emptyUpload">
                        <UploadIcon />
                        Upload files
                      </Button>
                    </EmptyContent>
                  )}
                </Empty>
              </TableCell>
            </TableRow>
          )}
          {items.map((item) => (
            <TableRow
              key={item.fullPath}
              data-testid="fileRow"
              data-name={item.name}
              data-type={item.type}
              className={cn(
                'cursor-pointer',
                selectedPath === item.fullPath && 'bg-muted/50'
              )}
              onClick={() => onOpen(item)}
            >
              <TableCell className="font-medium">
                <span className="flex items-center gap-2">
                  <StorageItemIcon
                    type={item.type}
                    contentType={item.type === 'file' ? item.contentType : null}
                  />
                  <span className="truncate">{item.name}</span>
                </span>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground">
                {item.type === 'file' ? formatBytes(item.size) : '—'}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {item.type === 'folder' ? 'Folder' : (item.contentType ?? '—')}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {item.type === 'file' && item.updated
                  ? new Date(item.updated).toLocaleDateString()
                  : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
