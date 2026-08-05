import { JSX } from 'react'
import { Skeleton } from '@workspace/ui/components/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'

const skeletonRows = Array.from({ length: 5 }, (_, index) => `skeleton-${index}`)

export default function Loading(): JSX.Element {
  return (
    <div className="flex flex-col gap-4" data-testid="tagsLoading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead className="hidden lg:table-cell">Description</TableHead>
              <TableHead className="hidden sm:table-cell">Updated</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows.map((key) => (
              <TableRow key={key}>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Skeleton className="size-8 rounded-md" />
                    <Skeleton className="size-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
