import { JSX } from 'react'
import { Skeleton } from '@workspace/ui/components/skeleton'

/**
 * The article shape while the story loads. Matches the detail page's own
 * ordering — cover, title, byline, body — so the layout does not jump when the
 * real content replaces it.
 */
export default function Loading(): JSX.Element {
  return (
    <article
      className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 pb-24"
      data-testid="storyDetailLoading"
    >
      <Skeleton className="aspect-video w-full rounded-2xl" />
      <Skeleton className="h-5 w-24 rounded-[100px]" />
      <Skeleton className="h-9 w-4/5" />
      <Skeleton className="h-5 w-52" />

      <div className="flex flex-col gap-2 pt-4">
        {['a', 'b', 'c', 'd', 'e'].map((key) => (
          <Skeleton key={key} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-2/3" />
      </div>
    </article>
  )
}
