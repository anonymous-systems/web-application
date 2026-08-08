import { JSX } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Mail } from 'lucide-react'
import { Layout } from '@/components/layout'
import { ThreeDSphere } from '@workspace/ui/components/three-d-sphere/three-d-sphere'
import { Button } from '@workspace/ui/components/custom/button'
import { Badge } from '@workspace/ui/components/custom/badge'
import { CompanyInformation } from '@workspace/ui/lib/company-information'
import { ContentGrid } from '@/components/content-grid'
import { StoryCard } from '@/components/story-card'
import { ProjectCard } from '@/components/project-card'
import { Magnetic } from '@/components/magnetic'
import { Reveal } from '@/components/reveal'
import { AppRoutes } from '@/lib/app-routes'
import { popularTopics } from '@/lib/popular-topics'
import { listPublishedStories } from '@/services/story-service'
import { listPublishedProjects } from '@/services/project-service'

export const metadata: Metadata = {
  // Absolute so the front page is not titled "Anonymous Systems | Anonymous
  // Systems" by the root template.
  title: { absolute: CompanyInformation.title },
  description: CompanyInformation.byline,
}

// Three fills one grid row at every breakpoint, so a section never ends on a
// half-empty row.
const FEATURED = 3
const TOPICS = 6

interface SectionProps {
  id: string
  heading: string
  description: string
  href: string
  linkLabel: string
  children: JSX.Element
}

const ContentSection = ({
  id,
  heading,
  description,
  href,
  linkLabel,
  children,
}: SectionProps): JSX.Element => (
  <Reveal className="w-full">
    <section id={id} className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">{heading}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <Button variant="ghost" asChild>
          <Link href={href}>
            {linkLabel}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </header>

      {children}
    </section>
  </Reveal>
)

/**
 * The front door: who we are, then the work, then the writing.
 *
 * Deliberately led by real content rather than the marketing sections it
 * replaced. Those were a template's — five dead call-to-action buttons, a
 * carousel of cards numbered one to five, empty grey blocks standing in for
 * images, and topic chips naming tags that did not exist. Nothing on the page
 * reached the stories or projects the site is actually for.
 */
const Page = async (): Promise<JSX.Element> => {
  const [stories, projects] = await Promise.all([
    listPublishedStories(),
    listPublishedProjects(),
  ])

  const featuredProjects = projects.slice(0, FEATURED)
  const latestStories = stories.slice(0, FEATURED)
  const topics = popularTopics(stories, TOPICS)

  return (
    <Layout dataTestId="homePage">
      <div className="flex flex-col items-center gap-20 p-4 pt-8">
        <section
          id="hero"
          className="flex w-full max-w-3xl flex-col items-center gap-6 text-center"
        >
          <ThreeDSphere />

          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Technology that moves your business forward
            </h1>

            <p className="text-muted-foreground text-lg text-pretty">
              {CompanyInformation.byline}. We build the systems, then make them even better.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <Button size="lg" asChild data-testid="heroPortfolioCta">
                <Link href={AppRoutes.portfolio}>
                  See our work
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </Magnetic>

            <Button variant="outline" size="lg" asChild>
              <Link href={`mailto:${CompanyInformation.email}`}>
                <CalendarDays className="size-4" aria-hidden />
                Book a consultation
              </Link>
            </Button>
          </div>
        </section>

        {featuredProjects.length > 0 && (
          <ContentSection
            id="work"
            heading="Selected work"
            description="Projects we have designed, built and shipped."
            href={AppRoutes.portfolio}
            linkLabel="All projects"
          >
            <ContentGrid>
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </ContentGrid>
          </ContentSection>
        )}

        {latestStories.length > 0 && (
          <ContentSection
            id="stories"
            heading="Latest stories"
            description="Insights, notes and write-ups from the work we do."
            href={AppRoutes.stories}
            linkLabel="All stories"
          >
            <ContentGrid>
              {latestStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </ContentGrid>
          </ContentSection>
        )}

        {topics.length > 0 && (
          <Reveal className="w-full">
            <section
              id="topics"
              className="mx-auto flex w-full max-w-5xl flex-col gap-4"
            >
              <h2 className="text-2xl font-semibold tracking-tight">
                Explore popular topics
              </h2>

              {/* Each chip is a real tag on published work, linking to the
                  stories filtered by it — the row it replaced was five
                  hardcoded names that matched nothing in the taxonomy. */}
              <ul className="flex flex-wrap gap-2" data-testid="homeTopics">
                {topics.map(({ term, count }) => (
                  <li key={term.id}>
                    <Link
                      href={`${AppRoutes.stories}?tag=${term.slug}`}
                      data-slug={term.slug}
                    >
                      <Badge
                        variant="outline"
                        className="hover:bg-accent cursor-pointer text-sm transition-colors"
                      >
                        {term.name}
                        <span className="text-muted-foreground ml-1.5">
                          {count}
                        </span>
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        )}

        <Reveal className="w-full">
          <section
            id="contact"
            className="bg-accent mx-auto flex w-full max-w-5xl flex-col items-center gap-4 rounded-2xl p-8 text-center"
          >
            <h2 className="text-2xl font-semibold tracking-tight text-balance">
              Have something you want built?
            </h2>

            <p className="text-muted-foreground text-pretty">
              Tell us what you are working on and we will tell you how we would
              approach it.
            </p>

            <Magnetic>
              <Button size="lg" asChild>
                <Link href={`mailto:${CompanyInformation.email}`}>
                  <Mail className="size-4" aria-hidden />
                  Get in touch
                </Link>
              </Button>
            </Magnetic>
          </section>
        </Reveal>
      </div>
    </Layout>
  )
}

export default Page
