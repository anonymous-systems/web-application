import { JSX } from 'react'
import { PencilIcon, PlusIcon, TagsIcon } from 'lucide-react'
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
import { DeleteTermDialog } from '@/components/taxonomy/delete-term-dialog'
import { createTag, deleteTag, updateTag } from './actions'

const SINGULAR = 'tag'

export default async function Page(): Promise<JSX.Element> {
  const tags = await listTerms('tags')

  return (
    <div className="flex flex-col gap-4" data-testid="tagsPage">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tags</h1>
          <p className="text-muted-foreground" data-testid="tagsCount">
            {tags.length} {tags.length === 1 ? 'tag' : 'tags'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RefreshButton />
          <TaxonomyFormDialog
            singular={SINGULAR}
            createAction={createTag}
            updateAction={updateTag}
            trigger={
              <Button data-testid="newTagButton">
                <PlusIcon />
                New tag
              </Button>
            }
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table data-testid="tagsTable">
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
            {tags.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5}>
                  <Empty data-testid="tagsEmpty">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <TagsIcon />
                      </EmptyMedia>
                      <EmptyTitle>No tags yet</EmptyTitle>
                      <EmptyDescription>
                        Tags label content so it can be filtered and related.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <TaxonomyFormDialog
                        singular={SINGULAR}
                        createAction={createTag}
                        updateAction={updateTag}
                        trigger={
                          <Button data-testid="emptyNewTagButton">
                            <PlusIcon />
                            New tag
                          </Button>
                        }
                      />
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
            {tags.map((tag) => (
              <TableRow key={tag.id} data-testid="tagRow" data-slug={tag.slug}>
                <TableCell className="font-medium">{tag.name}</TableCell>
                <TableCell className="text-muted-foreground">{tag.slug}</TableCell>
                <TableCell className="text-muted-foreground">
                  {tag.description ?? '—'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {tag.updatedAt ? new Date(tag.updatedAt).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <TaxonomyFormDialog
                      term={tag}
                      singular={SINGULAR}
                      createAction={createTag}
                      updateAction={updateTag}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${tag.name}`}
                          data-testid="editTermTrigger"
                        >
                          <PencilIcon />
                        </Button>
                      }
                    />
                    <DeleteTermDialog
                      term={tag}
                      singular={SINGULAR}
                      deleteAction={deleteTag}
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
