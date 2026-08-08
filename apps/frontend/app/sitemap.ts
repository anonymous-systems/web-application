import { MetadataRoute } from 'next'
import { CompanyInformation } from '@workspace/ui/lib/company-information'
import { AppRoutes } from '@/lib/app-routes'
import { listPublishedStories } from '@/services/story-service'
import { listPublishedProjects } from '@/services/project-service'

const base = CompanyInformation.website

/**
 * Generated per request, never at build time.
 *
 * Next prerenders a sitemap by default, which is wrong here twice over: content
 * published after a deploy would be missing until the next one, and — worse —
 * the build reads Firestore with no network, where the client SDK resolves
 * *empty from cache* rather than failing. That silently shipped a sitemap
 * listing six static routes and none of the content it exists to advertise.
 * Crawlers hit this rarely, so per-request generation costs almost nothing.
 */
export const dynamic = 'force-dynamic'

const staticRoutes: { path: string; priority: number }[] = [
  { path: AppRoutes.home, priority: 1 },
  { path: AppRoutes.stories, priority: 0.8 },
  { path: AppRoutes.portfolio, priority: 0.8 },
  { path: AppRoutes.welcome, priority: 0.5 },
  { path: AppRoutes.privacyPolicy, priority: 0.3 },
  { path: AppRoutes.termsAndConditions, priority: 0.3 },
]

/**
 * Every page a crawler should know about, with the content pulled live so a
 * newly published story appears without a redeploy.
 *
 * `lastModified` comes from the document rather than the build, which is the
 * whole value of the field — a build timestamp would mark every page as changed
 * on every deploy and tell a crawler nothing.
 */
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [stories, projects] = await Promise.all([
    listPublishedStories(),
    listPublishedProjects(),
  ])

  const changed = (updatedAt: string | null, publishedAt: string | null): Date =>
    new Date(updatedAt ?? publishedAt ?? Date.now())

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${base}${path}`,
      changeFrequency: 'weekly' as const,
      priority,
    })),
    ...stories.map((story) => ({
      url: `${base}${AppRoutes.storyDetail(story.slug)}`,
      lastModified: changed(story.updatedAt, story.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: `${base}${AppRoutes.portfolioDetail(project.slug)}`,
      lastModified: changed(project.updatedAt, project.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}

export default sitemap
