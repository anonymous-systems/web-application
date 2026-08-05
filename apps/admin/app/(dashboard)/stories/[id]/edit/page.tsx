import { JSX } from 'react'
import { notFound } from 'next/navigation'
import { listTerms } from '@/services/taxonomy-service'
import { getStory } from '@/services/story-service'
import { StoryForm } from '@/components/stories/story-form'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<JSX.Element> {
  const { id } = await params
  const [story, categories, tags] = await Promise.all([
    getStory(id),
    listTerms('categories'),
    listTerms('tags'),
  ])

  if (!story) notFound()

  return (
    <div className="flex flex-col gap-4" data-testid="editStoryPage">
      <h1 className="text-2xl font-bold">Edit story</h1>
      <StoryForm story={story} categories={categories} tags={tags} />
    </div>
  )
}
