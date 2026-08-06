import { JSX } from 'react'
import { Layout } from '@/components/layout'
import { ContentGrid } from '@/components/content-grid'
import { StoryCard } from '@/components/story-card'
import { ContentFilters, FilterOption } from '@/components/content-filters'
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
  { value: '', label: 'All' },
  ...STORY_TYPES.map((type) => ({ value: type, label: STORY_TYPE_LABELS[type] })),
]

const isStoryType = (value: string): value is StoryType =>
  STORY_TYPES.includes(value as StoryType)

interface Props {
  searchParams: Promise<{ type?: string }>
}

const Page = async ({ searchParams }: Props): Promise<JSX.Element> => {
  const { type = '' } = await searchParams
  // An unrecognised query value falls back to "all" rather than an empty list.
  const activeType = isStoryType(type) ? type : ''

  const stories = await listPublishedStories()
  const visible = activeType
    ? stories.filter((story) => story.type === activeType)
    : stories

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
                {activeType
                  ? 'Nothing published under this filter yet — try another.'
                  : 'Check back soon.'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </Layout>
  )
}

export default Page
