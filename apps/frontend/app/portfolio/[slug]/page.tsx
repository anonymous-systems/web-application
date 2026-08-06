import { JSX } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ExternalLink, Figma, Github } from 'lucide-react'
import { Layout } from '@/components/layout'
import { getPublishedProjectBySlug } from '@/services/project-service'
import { AspectRatio } from '@workspace/ui/components/aspect-ratio'
import { Badge } from '@workspace/ui/components/custom/badge'
import { Button } from '@workspace/ui/components/custom/button'
import { Divider } from '@workspace/ui/components/divider'
import { PROJECT_DEVELOPMENT_STATUS_LABELS } from '@workspace/ui/models/project-constants'

interface Props {
  params: Promise<{ slug: string }>
}

const Page = async ({ params }: Props): Promise<JSX.Element> => {
  const { slug } = await params
  const project = await getPublishedProjectBySlug(slug)
  if (!project) notFound()

  const chips =
    project.technologies.length > 0 ? project.technologies : project.tags

  const links = [
    { href: project.sourceCodeLink, label: 'Source code', Icon: Github },
    { href: project.livePreviewLink, label: 'Live preview', Icon: ExternalLink },
    { href: project.figmaLink, label: 'Figma', Icon: Figma },
  ].filter((link): link is typeof link & { href: string } => Boolean(link.href))

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
          /* Same trust model as story content — see app/stories/[slug]/page.tsx. */
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        ) : (
          <p className="text-muted-foreground">
            A fuller write-up for this project is on the way.
          </p>
        )}
      </article>
    </Layout>
  )
}

export default Page
