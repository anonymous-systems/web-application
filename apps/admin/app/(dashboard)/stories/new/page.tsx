import { JSX } from 'react'
import { listTerms } from '@/services/taxonomy-service'
import { StoryForm } from '@/components/stories/story-form'

export default async function Page(): Promise<JSX.Element> {
  const [categories, tags] = await Promise.all([
    listTerms('categories'),
    listTerms('tags'),
  ])

  return (
    <div className="flex flex-col gap-4" data-testid="newStoryPage">
      <h1 className="text-2xl font-bold">New story</h1>
      <StoryForm categories={categories} tags={tags} />
    </div>
  )
}
