import { db } from '@/lib/firestore'

export interface OverviewCounts {
  stories: number
  projects: number
  comments: number
  categories: number
  tags: number
  technologies: number
}

// Server-only (Admin SDK). Uses count() aggregation so the dashboard reads a
// single number per collection instead of pulling every document.
export const getOverviewCounts = async (): Promise<OverviewCounts> => {
  const [stories, projects, comments, categories, tags, technologies] =
    await Promise.all([
      db().collection('stories').count().get(),
      db().collection('projects').count().get(),
      db().collectionGroup('comments').count().get(),
      db().collection('categories').count().get(),
      db().collection('tags').count().get(),
      db().collection('technologies').count().get(),
    ])

  return {
    stories: stories.data().count,
    projects: projects.data().count,
    comments: comments.data().count,
    categories: categories.data().count,
    tags: tags.data().count,
    technologies: technologies.data().count,
  }
}
