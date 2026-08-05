import { JSX } from 'react'
import Link from 'next/link'
import { FolderGit2, LockIcon, PencilIcon, PlusIcon } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@workspace/ui/components/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import { Button } from '@workspace/ui/components/custom/button'
import { cn } from '@workspace/ui/lib/utils'
import {
  PROJECT_DEVELOPMENT_STATUS_LABELS,
  ProjectStatus,
} from '@workspace/ui/models/project-constants'
import { Project } from '@workspace/ui/models/interfaces/project'
import { listProjects } from '@/services/project-service'
import { RefreshButton } from '@/components/dashboard/refresh-button'
import { ConfirmDeleteDialog } from '@/components/dashboard/confirm-delete-dialog'
import { deleteProject } from './actions'

const STATUS_STYLES: Record<ProjectStatus, string> = {
  published: 'bg-primary/10 text-primary',
  draft: 'bg-muted text-muted-foreground',
  archived: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
}

const StatusBadge = ({ status }: { status: ProjectStatus }): JSX.Element => (
  <span
    className={cn(
      'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize',
      STATUS_STYLES[status]
    )}
  >
    {status}
  </span>
)

const developmentLabel = (status: Project['developmentStatus']): string =>
  status ? PROJECT_DEVELOPMENT_STATUS_LABELS[status] : '—'

export default async function Page(): Promise<JSX.Element> {
  const projects = await listProjects()

  return (
    <div className="flex flex-col gap-4" data-testid="projectsPage">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground" data-testid="projectsCount">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RefreshButton />
          <Button asChild>
            <Link href="/projects/new" data-testid="newProjectButton">
              <PlusIcon />
              New project
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table data-testid="projectsTable">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Development</TableHead>
              <TableHead className="hidden lg:table-cell">Updated</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5}>
                  <Empty data-testid="projectsEmpty">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <FolderGit2 />
                      </EmptyMedia>
                      <EmptyTitle>No projects yet</EmptyTitle>
                      <EmptyDescription>
                        Add your first project to showcase in the portfolio.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button asChild>
                        <Link
                          href="/projects/new"
                          data-testid="emptyNewProjectButton"
                        >
                          <PlusIcon />
                          New project
                        </Link>
                      </Button>
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
            {projects.map((project) => (
              <TableRow
                key={project.id}
                data-testid="projectRow"
                data-project-id={project.id}
                data-slug={project.slug}
              >
                <TableCell className="font-medium">
                  <span className="flex items-center gap-2">
                    {project.title || 'Untitled'}
                    {project.visibility === 'private' && (
                      <LockIcon
                        className="size-3 text-muted-foreground"
                        aria-label="Private"
                      />
                    )}
                  </span>
                  <span className="mt-1 flex items-center gap-2 text-xs font-normal text-muted-foreground sm:hidden">
                    <StatusBadge status={project.status} />
                    <span>{developmentLabel(project.developmentStatus)}</span>
                  </span>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <StatusBadge status={project.status} />
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {developmentLabel(project.developmentStatus)}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {project.updatedAt
                    ? new Date(project.updatedAt).toLocaleDateString()
                    : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link
                        href={`/projects/${project.id}/edit`}
                        aria-label={`Edit ${project.title}`}
                        data-testid="editProjectTrigger"
                      >
                        <PencilIcon />
                      </Link>
                    </Button>
                    <ConfirmDeleteDialog
                      entity="Project"
                      title="Delete project"
                      triggerLabel={`Delete ${project.title}`}
                      description={
                        <>
                          “{project.title}” will be permanently removed, along
                          with its comments. This can’t be undone.
                        </>
                      }
                      successMessage="Project deleted."
                      onConfirm={deleteProject.bind(null, project.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
