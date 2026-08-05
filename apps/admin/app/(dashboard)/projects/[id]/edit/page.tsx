import { JSX } from 'react'
import { notFound } from 'next/navigation'
import { listTerms } from '@/services/taxonomy-service'
import { getProject } from '@/services/project-service'
import { ProjectForm } from '@/components/projects/project-form'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<JSX.Element> {
  const { id } = await params
  const [project, categories, tags, technologies] = await Promise.all([
    getProject(id),
    listTerms('categories'),
    listTerms('tags'),
    listTerms('technologies'),
  ])

  if (!project) notFound()

  return (
    <div className="flex flex-col gap-4" data-testid="editProjectPage">
      <h1 className="text-2xl font-bold">Edit project</h1>
      <ProjectForm
        project={project}
        categories={categories}
        tags={tags}
        technologies={technologies}
      />
    </div>
  )
}
