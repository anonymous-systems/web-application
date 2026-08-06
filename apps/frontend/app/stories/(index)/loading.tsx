import { JSX } from 'react'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { ContentGrid } from '@/components/content-grid'

const skeletonCards = Array.from({ length: 6 }, (_, index) => `skeleton-${index}`)

export default function Loading(): JSX.Element {
  return (
    <div className="flex flex-col gap-6 p-4 pb-24" data-testid="storiesLoading">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-6 w-72 max-w-full" />
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'a', 'b', 'c'].map((key) => (
          <Skeleton key={key} className="h-9 w-20 rounded-[100px]" />
        ))}
      </div>

      <ContentGrid>
        {skeletonCards.map((key) => (
          <div key={key} className="flex flex-col gap-2">
            {/* Matches the story card's 16:9 cover. */}
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-5 w-20 rounded-[100px]" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </ContentGrid>
    </div>
  )
}
