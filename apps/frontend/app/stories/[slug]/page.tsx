import { JSX } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Clock } from 'lucide-react'
import { Layout } from '@/components/layout'
import { getPublishedStoryBySlug } from '@/services/story-service'
import { formatDate } from '@/lib/format-date'
import { AspectRatio } from '@workspace/ui/components/aspect-ratio'
import { Badge } from '@workspace/ui/components/custom/badge'
import { Divider } from '@workspace/ui/components/divider'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar'
import { initialsFrom } from '@workspace/ui/lib/initials'
import {
  PROBLEM_STATUS_LABELS,
  STORY_TYPE_LABELS,
} from '@workspace/ui/models/story-constants'

interface Props {
  params: Promise<{ slug: string }>
}

const Page = async ({ params }: Props): Promise<JSX.Element> => {
  const { slug } = await params
  const story = await getPublishedStoryBySlug(slug)
  if (!story) notFound()

  const published = formatDate(story.publishedAt ?? story.createdAt)
  const badge =
    story.type === 'problem' && story.problemStatus
      ? `${STORY_TYPE_LABELS.problem} · ${PROBLEM_STATUS_LABELS[story.problemStatus]}`
      : STORY_TYPE_LABELS[story.type]

  return (
    <Layout dataTestId="storyDetailPage">
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 pb-24">
        {story.coverImage && (
          <AspectRatio ratio={16 / 9} className="bg-accent overflow-hidden rounded-2xl">
            <Image
              src={story.coverImage}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </AspectRatio>
        )}

        <Badge variant="secondary" className="w-fit">
          {badge}
        </Badge>

        <h1 className="text-3xl font-semibold">{story.title}</h1>

        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
          <Avatar className="size-8">
            {story.authorAvatar && <AvatarImage src={story.authorAvatar} alt="" />}
            <AvatarFallback className="text-xs">
              {initialsFrom(story.authorName)}
            </AvatarFallback>
          </Avatar>

          {story.authorName && <span>{story.authorName}</span>}
          {published && <span>· {published}</span>}

          {story.readTimeMinutes !== null && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden />
              {story.readTimeMinutes} min read
            </span>
          )}
        </div>

        {story.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1">
            {story.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="outline">#{tag}</Badge>
              </li>
            ))}
          </ul>
        )}

        <Divider />

        {story.content ? (
          /*
           * CKEditor HTML, rendered as-is. This is only safe because authoring is
           * admin-only (middleware + `ensureAdmin`), so the markup is trusted.
           * `STORY_STATUSES` already reserves `pending` for a creator-submission
           * flow — that flow must sanitise on write before it ships, or this
           * becomes stored XSS.
           */
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />
        ) : (
          <p className="text-muted-foreground">
            {story.excerpt ?? 'This story has no content yet.'}
          </p>
        )}
      </article>
    </Layout>
  )
}

export default Page
