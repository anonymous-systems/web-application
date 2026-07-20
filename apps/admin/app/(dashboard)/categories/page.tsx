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
import { listCategories } from '@/services/category-service'
import { RefreshButton } from '@/components/dashboard/refresh-button'
import { CategoryFormDialog } from '@/components/categories/category-form-dialog'
import { DeleteCategoryDialog } from '@/components/categories/delete-category-dialog'

export default async function Page(): Promise<JSX.Element> {
  const categories = await listCategories()

  return (
    <div className="flex flex-col gap-4" data-testid="categoriesPage">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground" data-testid="categoriesCount">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RefreshButton />
          <CategoryFormDialog
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
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Updated</TableHead>
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
                      <CategoryFormDialog
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
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                <TableCell className="text-muted-foreground">
                  {category.description ?? '—'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {category.updatedAt
                    ? new Date(category.updatedAt).toLocaleDateString()
                    : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <CategoryFormDialog
                      category={category}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${category.name}`}
                          data-testid="editCategoryTrigger"
                        >
                          <PencilIcon />
                        </Button>
                      }
                    />
                    <DeleteCategoryDialog category={category} />
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
