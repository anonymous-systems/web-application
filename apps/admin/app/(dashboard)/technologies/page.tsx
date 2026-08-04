import { JSX } from 'react'
import { Cpu, PencilIcon, PlusIcon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@workspace/ui/components/empty'
import { Button } from '@workspace/ui/components/custom/button'
import { listTerms } from '@/services/taxonomy-service'
import { RefreshButton } from '@/components/dashboard/refresh-button'
import { TaxonomyFormDialog } from '@/components/taxonomy/taxonomy-form-dialog'
import { ConfirmDeleteDialog } from '@/components/dashboard/confirm-delete-dialog'
import {
  createTechnology,
  deleteTechnology,
  updateTechnology,
} from './actions'

const SINGULAR = 'technology'

export default async function Page(): Promise<JSX.Element> {
  const technologies = await listTerms('technologies')

  return (
    <div className="flex flex-col gap-4" data-testid="technologiesPage">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Technologies</h1>
          <p className="text-muted-foreground" data-testid="technologiesCount">
            {technologies.length}{' '}
            {technologies.length === 1 ? 'technology' : 'technologies'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RefreshButton />
          <TaxonomyFormDialog
            singular={SINGULAR}
            createAction={createTechnology}
            updateAction={updateTechnology}
            trigger={
              <Button data-testid="newTechnologyButton">
                <PlusIcon />
                New technology
              </Button>
            }
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table data-testid="technologiesTable">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead className="hidden lg:table-cell">Description</TableHead>
              <TableHead className="hidden sm:table-cell">Updated</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {technologies.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5}>
                  <Empty data-testid="technologiesEmpty">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Cpu />
                      </EmptyMedia>
                      <EmptyTitle>No technologies yet</EmptyTitle>
                      <EmptyDescription>
                        Technologies make up the tech stack shown on projects.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <TaxonomyFormDialog
                        singular={SINGULAR}
                        createAction={createTechnology}
                        updateAction={updateTechnology}
                        trigger={
                          <Button data-testid="emptyNewTechnologyButton">
                            <PlusIcon />
                            New technology
                          </Button>
                        }
                      />
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
            {technologies.map((technology) => (
              <TableRow
                key={technology.id}
                data-testid="technologyRow"
                data-slug={technology.slug}
              >
                <TableCell className="font-medium">
                  {technology.name}
                  <span className="block text-xs font-normal text-muted-foreground md:hidden">
                    {technology.slug}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {technology.slug}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {technology.description ?? '—'}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {technology.updatedAt
                    ? new Date(technology.updatedAt).toLocaleDateString()
                    : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <TaxonomyFormDialog
                      term={technology}
                      singular={SINGULAR}
                      createAction={createTechnology}
                      updateAction={updateTechnology}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${technology.name}`}
                          data-testid="editTermTrigger"
                        >
                          <PencilIcon />
                        </Button>
                      }
                    />
                    <ConfirmDeleteDialog
                      entity="Term"
                      title={`Delete ${SINGULAR}`}
                      triggerLabel={`Delete ${technology.name}`}
                      description={
                        <>
                          “{technology.name}” will be permanently removed. This
                          can’t be undone.
                        </>
                      }
                      successMessage={`${SINGULAR} deleted.`}
                      onConfirm={deleteTechnology.bind(null, technology.id)}
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
