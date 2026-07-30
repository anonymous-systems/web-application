import { JSX } from 'react'
import { FolderTreeIcon, PencilIcon, PlusIcon } from 'lucide-react'
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
import { createCategory, deleteCategory, updateCategory } from './actions'

const SINGULAR = 'category'

export default async function Page(): Promise<JSX.Element> {
  const categories = await listTerms('categories')

  return (
    <div className="flex flex-col gap-4" data-testid="categoriesPage">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground" data-testid="categoriesCount">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RefreshButton />
          <TaxonomyFormDialog
            singular={SINGULAR}
            createAction={createCategory}
            updateAction={updateCategory}
            trigger={
              <Button data-testid="newCategoryButton">
                <PlusIcon />
                New category
              </Button>
            }
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table data-testid="categoriesTable">
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
            {categories.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5}>
                  <Empty data-testid="categoriesEmpty">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <FolderTreeIcon />
                      </EmptyMedia>
                      <EmptyTitle>No categories yet</EmptyTitle>
                      <EmptyDescription>
                        Categories group the content shown on the site.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <TaxonomyFormDialog
                        singular={SINGULAR}
                        createAction={createCategory}
                        updateAction={updateCategory}
                        trigger={
                          <Button data-testid="emptyNewCategoryButton">
                            <PlusIcon />
                            New category
                          </Button>
                        }
                      />
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
            {categories.map((category) => (
              <TableRow
                key={category.id}
                data-testid="categoryRow"
                data-slug={category.slug}
              >
                <TableCell className="font-medium">
                  {category.name}
                  <span className="block text-xs font-normal text-muted-foreground md:hidden">
                    {category.slug}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {category.slug}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {category.description ?? '—'}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {category.updatedAt
                    ? new Date(category.updatedAt).toLocaleDateString()
                    : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <TaxonomyFormDialog
                      term={category}
                      singular={SINGULAR}
                      createAction={createCategory}
                      updateAction={updateCategory}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${category.name}`}
                          data-testid="editTermTrigger"
                        >
                          <PencilIcon />
                        </Button>
                      }
                    />
                    <ConfirmDeleteDialog
                      entity="Term"
                      title={`Delete ${SINGULAR}`}
                      triggerLabel={`Delete ${category.name}`}
                      description={
                        <>
                          “{category.name}” will be permanently removed. This
                          can't be undone.
                        </>
                      }
                      successMessage={`${SINGULAR} deleted.`}
                      onConfirm={deleteCategory.bind(null, category.id)}
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
