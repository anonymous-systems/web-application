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
    <div className="flex flex-col gap-4" data-testid="usersLoading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden lg:table-cell">Username</TableHead>
              <TableHead>Access</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {skeletonRows.map((key) => (
              <TableRow key={key}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-8 shrink-0 rounded-full" />
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-md" />
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
