import { JSX } from 'react'
import Link from 'next/link'
import { BookTextIcon, LockIcon, PencilIcon, PlusIcon } from 'lucide-react'
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
import { StoryStatus } from '@workspace/ui/models/story-constants'
import { listStories } from '@/services/story-service'
import { RefreshButton } from '@/components/dashboard/refresh-button'
import { ConfirmDeleteDialog } from '@/components/dashboard/confirm-delete-dialog'
import { deleteStory } from './actions'

const STATUS_STYLES: Record<StoryStatus, string> = {
  published: 'bg-primary/10 text-primary',
  draft: 'bg-muted text-muted-foreground',
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
}

const StatusBadge = ({ status }: { status: StoryStatus }): JSX.Element => (
  <span
    className={cn(
      'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize',
      STATUS_STYLES[status]
    )}
  >
    {status}
  </span>
)

export default async function Page(): Promise<JSX.Element> {
  const stories = await listStories()

  return (
    <div className="flex flex-col gap-4" data-testid="storiesPage">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stories</h1>
          <p className="text-muted-foreground" data-testid="storiesCount">
            {stories.length} {stories.length === 1 ? 'story' : 'stories'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RefreshButton />
          <Button asChild>
            <Link href="/stories/new" data-testid="newStoryButton">
              <PlusIcon />
              New story
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table data-testid="storiesTable">
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Updated</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5}>
                  <Empty data-testid="storiesEmpty">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <BookTextIcon />
                      </EmptyMedia>
                      <EmptyTitle>No stories yet</EmptyTitle>
                      <EmptyDescription>
                        Create your first story to share on the site.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button asChild>
                        <Link href="/stories/new" data-testid="emptyNewStoryButton">
                          <PlusIcon />
                          New story
                        </Link>
                      </Button>
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
            {stories.map((story) => (
              <TableRow
                key={story.id}
                data-testid="storyRow"
                data-story-id={story.id}
                data-slug={story.slug}
              >
                <TableCell className="font-medium">
                  <span className="flex items-center gap-2">
                    {story.title || 'Untitled'}
                    {story.visibility === 'private' && (
                      <LockIcon
                        className="size-3 text-muted-foreground"
                        aria-label="Private"
                      />
                    )}
                  </span>
                  <span className="mt-1 flex items-center gap-2 text-xs font-normal text-muted-foreground sm:hidden">
                    <StatusBadge status={story.status} />
                    <span className="capitalize">{story.type}</span>
                  </span>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <StatusBadge status={story.status} />
                </TableCell>
                <TableCell className="hidden md:table-cell capitalize text-muted-foreground">
                  {story.type}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {story.updatedAt
                    ? new Date(story.updatedAt).toLocaleDateString()
                    : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link
                        href={`/stories/${story.id}/edit`}
                        aria-label={`Edit ${story.title}`}
                        data-testid="editStoryTrigger"
                      >
                        <PencilIcon />
                      </Link>
                    </Button>
                    <ConfirmDeleteDialog
                      entity="Story"
                      title="Delete story"
                      triggerLabel={`Delete ${story.title}`}
                      description={
                        <>
                          “{story.title}” will be permanently removed, along with
                          its comments. This can’t be undone.
                        </>
                      }
                      successMessage="Story deleted."
                      onConfirm={deleteStory.bind(null, story.id)}
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
