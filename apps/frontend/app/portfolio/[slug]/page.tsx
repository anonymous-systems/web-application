import { JSX } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Layout } from '@/components/layout'
import { TrustedHtml } from '@/components/trusted-html'
import { CommentsSection } from '@/components/comments-section'
import { getPublishedProjectBySlug } from '@/services/project-service'
import { projectChips, projectLinks } from '@/lib/content-display'
import { AspectRatio } from '@workspace/ui/components/aspect-ratio'
import { Badge } from '@workspace/ui/components/custom/badge'
import { Button } from '@workspace/ui/components/custom/button'
import { Divider } from '@workspace/ui/components/divider'
import { PROJECT_DEVELOPMENT_STATUS_LABELS } from '@workspace/ui/models/project-constants'

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * Per-project title, description and social card. Next dedupes this read
 * against the one in the page body, so it costs no extra Firestore query.
 *
 * The missing-project check lives here rather than only in the page: metadata
 * resolves before the response starts streaming, so `notFound()` can still set
 * a 404. Thrown from the body instead, the chunked response has already
 * committed a 200 and crawlers index the not-found page.
 */
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params
  const project = await getPublishedProjectBySlug(slug)
  if (!project) notFound()

  return {
    title: `${project.title} | Anonymous Systems`,
    description: project.excerpt ?? undefined,
    openGraph: {
      title: project.title,
      description: project.excerpt ?? undefined,
      type: 'article',
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  }
}

const Page = async ({ params }: Props): Promise<JSX.Element> => {
  const { slug } = await params
  const project = await getPublishedProjectBySlug(slug)
  if (!project) notFound()

  const chips = projectChips(project)
  const links = projectLinks(project)

  return (
    <Layout dataTestId="projectDetailPage">
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 pb-24">
        {project.coverImage && (
          <AspectRatio ratio={4 / 3} className="bg-accent overflow-hidden rounded-2xl">
            <Image
              src={project.coverImage}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </AspectRatio>
        )}

        {project.developmentStatus && (
          <Badge variant="outline" className="w-fit">
            {PROJECT_DEVELOPMENT_STATUS_LABELS[project.developmentStatus]}
          </Badge>
        )}

        <h1 className="text-3xl font-semibold">{project.title}</h1>

        {project.excerpt && (
          <p className="body-lg text-muted-foreground">{project.excerpt}</p>
        )}

        {chips.length > 0 && (
          <ul className="flex flex-wrap gap-1">
            {chips.map((chip) => (
              <li key={chip}>
                <Badge variant="secondary">{chip}</Badge>
              </li>
            ))}
          </ul>
        )}

        {links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {links.map(({ href, label, Icon }) => (
              <Button key={label} asChild variant="outline" size="sm">
                <a href={href} target="_blank" rel="noreferrer noopener">
                  <Icon aria-hidden />
                  {label}
                </a>
              </Button>
            ))}
          </div>
        )}

        <Divider />

        {project.content ? (
          <TrustedHtml html={project.content} />
        ) : (
          <p className="text-muted-foreground">
            A fuller write-up for this project is on the way.
          </p>
        )}

        <CommentsSection
          parentType="project"
          parentId={project.id}
          allowComments={project.allowComments}
        />
      </article>
    </Layout>
  )
}

export default Page
