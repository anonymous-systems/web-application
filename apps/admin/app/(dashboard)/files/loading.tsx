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

const skeletonRows = Array.from({ length: 6 }, (_, index) => `skeleton-${index}`)

export default function Loading(): JSX.Element {
  return (
    <div className="flex flex-col gap-4" data-testid="filesLoading">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-12 w-full rounded-lg" />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Size</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Modified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows.map((key) => (
              <TableRow key={key}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-4 rounded" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
