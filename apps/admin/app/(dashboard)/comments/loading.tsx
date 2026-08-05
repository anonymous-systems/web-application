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
    <div className="flex flex-col gap-4" data-testid="commentsLoading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Comment</TableHead>
              <TableHead className="hidden md:table-cell">Story</TableHead>
              <TableHead className="hidden md:table-cell">Posted</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows.map((key) => (
              <TableRow key={key}>
                <TableCell>
                  <div className="flex items-start gap-3">
                    <Skeleton className="size-8 shrink-0 rounded-full" />
                    <div className="flex flex-1 flex-col gap-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-full max-w-md" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="size-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
