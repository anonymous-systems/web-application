import { JSX } from 'react'
import { Layout } from '@/components/layout'
import { ContentGrid } from '@/components/content-grid'
import { ProjectCard } from '@/components/project-card'
import {
  ALL_FILTER,
  ContentFilters,
  FilterOption,
} from '@/components/content-filters'
import { listPublishedProjects } from '@/services/project-service'
import { AppRoutes } from '@/lib/app-routes'
import {
  PROJECT_DEVELOPMENT_STATUS_LABELS,
  PROJECT_DEVELOPMENT_STATUSES,
  ProjectDevelopmentStatus,
} from '@workspace/ui/models/project-constants'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@workspace/ui/components/empty'

const filterOptions: FilterOption[] = [
  { value: ALL_FILTER, label: 'All' },
  ...PROJECT_DEVELOPMENT_STATUSES.map((status) => ({
    value: status,
    label: PROJECT_DEVELOPMENT_STATUS_LABELS[status],
  })),
]

const isDevelopmentStatus = (value: string): value is ProjectDevelopmentStatus =>
  PROJECT_DEVELOPMENT_STATUSES.includes(value as ProjectDevelopmentStatus)

interface Props {
  searchParams: Promise<{ status?: string }>
}

export const metadata = {
  title: 'Portfolio | Anonymous Systems',
  description: 'Explore our portfolio and see what we\'ve accomplished.',
}

const Page = async ({ searchParams }: Props): Promise<JSX.Element> => {
  const { status = '' } = await searchParams
  // An unrecognised query value falls back to "all" rather than an empty list.
  const activeStatus = isDevelopmentStatus(status) ? status : ALL_FILTER

  const projects = await listPublishedProjects()
  const visible =
    activeStatus === ALL_FILTER
      ? projects
      : projects.filter(
        (project) => project.developmentStatus === activeStatus
      )

  return (
    <Layout dataTestId="portfolioPage">
      <div className="flex flex-col gap-6 p-4 pb-24">
        <header className="flex flex-col gap-2">
          <h1 className="title-lg">Discover Our Work</h1>
          <p className="body-lg text-muted-foreground text-center">
            Explore our portfolio and see what we&apos;ve accomplished.
          </p>
        </header>

        <ContentFilters
          options={filterOptions}
          value={activeStatus}
          basePath={AppRoutes.portfolio}
          paramName="status"
        />

        {visible.length > 0 ? (
          <ContentGrid>
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </ContentGrid>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No projects yet</EmptyTitle>
              <EmptyDescription>
                {activeStatus === ALL_FILTER
                  ? 'Check back soon.'
                  : 'Nothing published under this filter yet — try another.'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </Layout>
  )
}

export default Page
