import { JSX } from 'react'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FolderOpenIcon,
  UploadIcon,
} from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@workspace/ui/components/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Button } from '@workspace/ui/components/custom/button'
import { cn } from '@workspace/ui/lib/utils'
import { StorageItemIcon } from './storage-item-icon'
import { formatBytes } from '@/lib/format-bytes'
import { StorageItem } from '@/interfaces/storage-item'

export type SortKey = 'name' | 'size' | 'updated'
export interface Sort {
  key: SortKey
  dir: 'asc' | 'desc'
}

interface Props {
  items: StorageItem[]
  onOpen: (item: StorageItem) => void
  selectedPath?: string | null
  selectedPaths: Set<string>
  onToggle: (item: StorageItem) => void
  onToggleAll: (checked: boolean) => void
  sort: Sort
  onSort: (key: SortKey) => void
  onUploadClick?: () => void
}

export const FileTable = ({
  items,
  onOpen,
  selectedPath,
  selectedPaths,
  onToggle,
  onToggleAll,
  sort,
  onSort,
  onUploadClick,
}: Props): JSX.Element => {
  const allSelected = items.length > 0 && selectedPaths.size === items.length

  const SortHeader = ({
    label,
    sortKey,
  }: {
    label: string
    sortKey: SortKey
  }): JSX.Element => (
    <button
      type="button"
      className="flex items-center gap-1 hover:text-foreground"
      onClick={() => onSort(sortKey)}
      data-testid={`sort-${sortKey}`}
    >
      {label}
      {sort.key === sortKey &&
        (sort.dir === 'asc' ? (
          <ChevronUpIcon className="size-3.5" />
        ) : (
          <ChevronDownIcon className="size-3.5" />
        ))}
    </button>
  )

  return (
    <div className="rounded-lg border">
      <Table data-testid="filesTable">
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={
                  allSelected ? true : selectedPaths.size > 0 ? 'indeterminate' : false
                }
                onCheckedChange={(checked) => onToggleAll(checked === true)}
                disabled={items.length === 0}
                aria-label="Select all"
                data-testid="fmSelectAll"
              />
            </TableHead>
            <TableHead>
              <SortHeader label="Name" sortKey="name" />
            </TableHead>
            <TableHead className="hidden sm:table-cell">
              <SortHeader label="Size" sortKey="size" />
            </TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="hidden lg:table-cell">
              <SortHeader label="Modified" sortKey="updated" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5}>
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
              <TableCell className="w-10" onClick={(event) => event.stopPropagation()}>
                <Checkbox
                  checked={selectedPaths.has(item.fullPath)}
                  onCheckedChange={() => onToggle(item)}
                  aria-label={`Select ${item.name}`}
                  data-testid="fileCheckbox"
                />
              </TableCell>
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
