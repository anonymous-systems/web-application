import { JSX } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ImageOff } from 'lucide-react'
import { Card } from '@workspace/ui/components/card'
import { AspectRatio } from '@workspace/ui/components/aspect-ratio'
import { Badge } from '@workspace/ui/components/custom/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Story } from '@workspace/ui/models/interfaces/story'
import {
  PROBLEM_STATUS_LABELS,
  STORY_TYPE_LABELS,
} from '@workspace/ui/models/story-constants'
import { initialsFrom } from '@workspace/ui/lib/initials'
import { formatDate } from '@/lib/format-date'
import { AppRoutes } from '@/lib/app-routes'

interface Props {
  story: Story
}

/**
 * A story as an editorial card: wide 16:9 cover, content-type badge, and a
 * byline of author, date and read time. Kept separate from ProjectCard on
 * purpose — the shapes and metadata are what tell the two content types apart
 * at a glance, so sharing one component would defeat the point.
 */
export const StoryCard = ({ story }: Props): JSX.Element => {
  const published = formatDate(story.publishedAt ?? story.createdAt)
  // A `problem` carries its open/resolved state; every other type is just its name.
  const badge =
    story.type === 'problem' && story.problemStatus
      ? `${STORY_TYPE_LABELS.problem} · ${PROBLEM_STATUS_LABELS[story.problemStatus]}`
      : STORY_TYPE_LABELS[story.type]

  return (
    <Card className="relative gap-0 overflow-hidden py-0">
      <AspectRatio ratio={16 / 9} className="bg-accent">
        {story.coverImage ? (
          <Image
            src={story.coverImage}
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
        <Badge variant="secondary" className="w-fit">
          {badge}
        </Badge>

        <h3 className="text-lg font-semibold">
          {/* Stretches over the whole card so the cover is clickable too. */}
          <Link
            href={AppRoutes.storyDetail(story.slug)}
            className="after:absolute after:inset-0 hover:underline"
          >
            {story.title}
          </Link>
        </h3>

        {story.excerpt && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {story.excerpt}
          </p>
        )}

        <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-2 text-xs">
          <Avatar className="size-6">
            {story.authorAvatar && <AvatarImage src={story.authorAvatar} alt="" />}
            <AvatarFallback className="text-[10px]">
              {initialsFrom(story.authorName)}
            </AvatarFallback>
          </Avatar>

          {story.authorName && <span>{story.authorName}</span>}
          {published && <span>· {published}</span>}

          {story.readTimeMinutes !== null && (
            <span className="ml-auto inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden />
              {story.readTimeMinutes} min read
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}
