import { JSX } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Divider } from '@workspace/ui/components/divider'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@workspace/ui/components/empty'
import { initialsFrom } from '@workspace/ui/lib/initials'
import { Layout } from '@/components/layout'
import { ContentGrid } from '@/components/content-grid'
import { StoryCard } from '@/components/story-card'
import { ProjectCard } from '@/components/project-card'
import { getPublicProfile } from '@/services/public-profile-service'

interface Props {
  params: Promise<{ username: string }>
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { username } = await params
  const profile = await getPublicProfile(username)

  if (!profile) return { title: 'Profile not found' }

  const name = profile.name ?? `@${profile.username}`

  return {
    title: name,
    description: `Stories and projects published by ${name}.`,
    // A profile is a person, not an article — `profile` is the type crawlers
    // and social cards expect here.
    openGraph: { type: 'profile', title: name, images: profile.avatar ?? [] },
  }
}

/**
 * Someone's public profile: who they are, and everything they have published.
 *
 * Reachable by username rather than uid, resolved through the `usernames`
 * index — the rules allow reading one entry there but not listing them, so a
 * profile URL cannot be turned into a directory of everyone on the site.
 */
const Page = async ({ params }: Props): Promise<JSX.Element> => {
  const { username } = await params
  const profile = await getPublicProfile(username)

  // A username nobody holds is a missing page, not an empty profile.
  if (!profile) notFound()

  const displayName = profile.name ?? `@${profile.username}`
  const published = profile.stories.length + profile.projects.length

  return (
    <Layout dataTestId="publicProfilePage">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-4 pb-24">
        <header className="flex flex-col items-center gap-3 text-center">
          <Avatar className="size-24">
            {profile.avatar && <AvatarImage src={profile.avatar} alt="" />}
            <AvatarFallback className="text-2xl">
              {initialsFrom(profile.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold tracking-tight">
              {displayName}
            </h1>
            <p className="text-muted-foreground" data-testid="profileUsername">
              @{profile.username}
            </p>
          </div>
        </header>

        <Divider />

        {published === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Nothing published yet</EmptyTitle>
              <EmptyDescription>
                {displayName} hasn&apos;t published any stories or projects.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            {profile.projects.length > 0 && (
              <section className="flex flex-col gap-4" data-testid="profileProjects">
                <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
                <ContentGrid>
                  {profile.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </ContentGrid>
              </section>
            )}

            {profile.stories.length > 0 && (
              <section className="flex flex-col gap-4" data-testid="profileStories">
                <h2 className="text-2xl font-semibold tracking-tight">Stories</h2>
                <ContentGrid>
                  {profile.stories.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </ContentGrid>
              </section>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default Page
