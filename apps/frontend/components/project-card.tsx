import { JSX } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ImageOff } from 'lucide-react'
import { Card } from '@workspace/ui/components/card'
import { AspectRatio } from '@workspace/ui/components/aspect-ratio'
import { Badge } from '@workspace/ui/components/custom/badge'
import { Project } from '@workspace/ui/models/interfaces/project'
import { PROJECT_DEVELOPMENT_STATUS_LABELS } from '@workspace/ui/models/project-constants'
import { projectChips, projectLinks } from '@/lib/content-display'
import { AppRoutes } from '@/lib/app-routes'

interface Props {
  project: Project
}

/**
 * A project as an artifact card: squarer 4:3 cover, lifecycle badge, the stack
 * it was built with, and direct links out to the source, live site and design.
 * Deliberately not the same component as StoryCard — the tech chips and link
 * row are what make a project recognisable next to a story.
 */
export const ProjectCard = ({ project }: Props): JSX.Element => {
  const chips = projectChips(project)
  const links = projectLinks(project)

  return (
    <Card className="relative gap-0 overflow-hidden py-0">
      <AspectRatio ratio={4 / 3} className="bg-accent">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 300px"
            className="object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            <ImageOff aria-hidden />
          </div>
        )}
      </AspectRatio>

      <div className="flex flex-col gap-2 p-4">
        {project.developmentStatus && (
          <Badge variant="outline" className="w-fit">
            {PROJECT_DEVELOPMENT_STATUS_LABELS[project.developmentStatus]}
          </Badge>
        )}

        <h3 className="text-lg font-semibold">
          {/* Stretches over the whole card; the link row below sits above it. */}
          <Link
            href={AppRoutes.portfolioDetail(project.slug)}
            className="after:absolute after:inset-0 hover:underline"
          >
            {project.title}
          </Link>
        </h3>

        {project.excerpt && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {project.excerpt}
          </p>
        )}

        {chips.length > 0 && (
          <ul className="flex flex-wrap gap-1">
            {chips.map((chip) => (
              <li key={chip}>
                <Badge variant="secondary" className="text-[11px]">
                  {chip}
                </Badge>
              </li>
            ))}
          </ul>
        )}

        {links.length > 0 && (
          <div className="relative z-10 mt-2 flex gap-3">
            {links.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                title={label}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon className="size-4" aria-hidden />
              </a>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
