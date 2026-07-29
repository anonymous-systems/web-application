import { JSX } from 'react'
import { Skeleton } from '@workspace/ui/components/skeleton'

// Fallback for sections without their own loading.tsx, so navigation shows an
// instant placeholder instead of leaving the previous page on screen.
export default function Loading(): JSX.Element {
  return (
    <div className="flex flex-col gap-2" data-testid="dashboardLoading">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-4 w-72 max-w-full" />
    </div>
  )
}
