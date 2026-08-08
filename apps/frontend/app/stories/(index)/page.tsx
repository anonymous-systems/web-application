import { JSX } from 'react'
import Link from 'next/link'
import { Layout } from '@/components/layout'
import { ContentGrid } from '@/components/content-grid'
import { StoryCard } from '@/components/story-card'
import {
  ALL_FILTER,
  ContentFilters,
  FilterOption,
} from '@/components/content-filters'
import { listPublishedStories } from '@/services/story-service'
import { AppRoutes } from '@/lib/app-routes'
import {
  STORY_TYPE_LABELS,
  STORY_TYPES,
  StoryType,
} from '@workspace/ui/models/story-constants'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@workspace/ui/components/empty'

const filterOptions: FilterOption[] = [
  { value: ALL_FILTER, label: 'All' },
  ...STORY_TYPES.map((type) => ({ value: type, label: STORY_TYPE_LABELS[type] })),
]

const isStoryType = (value: string): value is StoryType =>
  STORY_TYPES.includes(value as StoryType)

interface Props {
  searchParams: Promise<{ type?: string; tag?: string }>
}

export const metadata = {
  title: 'Stories',
  description: 'Insights, notes and write-ups from the work we do.',
}

const Page = async ({ searchParams }: Props): Promise<JSX.Element> => {
  const { type = '', tag = '' } = await searchParams
  const activeType = isStoryType(type) ? type : ALL_FILTER

  const stories = await listPublishedStories()

  // Type comes from the chips, tag from a topic link on the home page. They
  // compose rather than replace each other, so narrowing by one keeps the other.
  const byType =
    activeType === ALL_FILTER
      ? stories
      : stories.filter((story) => story.type === activeType)
  const visible = tag
    ? byType.filter((story) => story.tags.some((term) => term.slug === tag))
    : byType

  // Named from the stories themselves so a tag that no longer exists, or was
  // renamed, shows the slug rather than an empty heading.
  const tagName =
    visible.flatMap((story) => story.tags).find((term) => term.slug === tag)
      ?.name ?? tag

  return (
    <Layout dataTestId="storiesPage">
      <div className="flex flex-col gap-6 p-4 pb-24">
        <header className="flex flex-col gap-2">
          <h1 className="title-lg">Our Stories</h1>
          <p className="body-lg text-muted-foreground text-center">
            Insights, notes and write-ups from the work we do.
          </p>
        </header>

        <ContentFilters
          options={filterOptions}
          value={activeType}
          basePath={AppRoutes.stories}
          paramName="type"
        />

        {tag && (
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">
              Tagged <span className="text-foreground font-medium">{tagName}</span>
            </span>
            <Link
              href={AppRoutes.stories}
              className="text-muted-foreground hover:text-foreground underline underline-offset-4"
              data-testid="clearTagFilter"
            >
              Clear
            </Link>
          </div>
        )}

        {visible.length > 0 ? (
          <ContentGrid>
            {visible.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </ContentGrid>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No stories yet</EmptyTitle>
              <EmptyDescription>
                {activeType === ALL_FILTER && !tag
                  ? 'Check back soon.'
                  : 'Nothing published under this filter yet — try another.'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </Layout>
  )
}

export default Page
