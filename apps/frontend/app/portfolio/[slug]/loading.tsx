import { JSX } from 'react'
import { Skeleton } from '@workspace/ui/components/skeleton'

/** See the story detail loading state — same intent, the project's 4:3 cover. */
export default function Loading(): JSX.Element {
  return (
    <article
      className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 pb-24"
      data-testid="projectDetailLoading"
    >
      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      <Skeleton className="h-9 w-4/5" />
      <Skeleton className="h-5 w-40" />

      <div className="flex flex-wrap gap-2">
        {['a', 'b', 'c'].map((key) => (
          <Skeleton key={key} className="h-6 w-20 rounded-[100px]" />
        ))}
      </div>

      <div className="flex flex-col gap-2 pt-4">
        {['a', 'b', 'c', 'd'].map((key) => (
          <Skeleton key={key} className="h-4 w-full" />
        ))}
      </div>
    </article>
  )
}
