import { JSX } from 'react'
import { listTerms } from '@/services/taxonomy-service'
import { ProjectForm } from '@/components/projects/project-form'

export default async function Page(): Promise<JSX.Element> {
  const [categories, tags, technologies] = await Promise.all([
    listTerms('categories'),
    listTerms('tags'),
    listTerms('technologies'),
  ])

  return (
    <div className="flex flex-col gap-4" data-testid="newProjectPage">
      <h1 className="text-2xl font-bold">New project</h1>
      <ProjectForm
        categories={categories}
        tags={tags}
        technologies={technologies}
      />
    </div>
  )
}
