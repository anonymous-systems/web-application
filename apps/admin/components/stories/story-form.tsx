'use client'

import { JSX, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { toast } from '@workspace/ui/components/sonner'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'
import { Label } from '@workspace/ui/components/label'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Button } from '@workspace/ui/components/custom/button'
import {
  PROBLEM_STATUSES,
  ProblemStatus,
  STORY_TYPES,
  STORY_VISIBILITIES,
  StoryStatus,
  StoryType,
  StoryVisibility,
} from '@workspace/ui/models/story-constants'
import { StoryInput } from '@workspace/ui/models/schemas/story'
import { Story } from '@workspace/ui/models/interfaces/story'
import { createStory, updateStory } from '@/app/(dashboard)/stories/actions'

// CKEditor touches `window`, so it's loaded client-only.
const StoryEditor = dynamic(
  () => import('./story-editor').then((module) => module.StoryEditor),
  {
    ssr: false,
    loading: () => (
      <div className="text-sm text-muted-foreground">Loading editor…</div>
    ),
  }
)

interface TermOption {
  name: string
  slug: string
}

interface Props {
  /** Present when editing; omitted when creating. */
  story?: Story
  categories: TermOption[]
  tags: TermOption[]
}

interface FormValues {
  title: string
  type: StoryType
  excerpt: string
  content: string
  category: string
  tags: string[]
  visibility: StoryVisibility
  allowComments: boolean
  featured: boolean
  problemStatus: '' | ProblemStatus
}

// Native <select> styled to match the shared Input; the OS picker it triggers is
// the friendliest control on touch devices.
const CONTROL =
  'border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'

const titleCase = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1)

export const StoryForm = ({ story, categories, tags }: Props): JSX.Element => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [values, setValues] = useState<FormValues>({
    title: story?.title ?? '',
    type: story?.type ?? 'article',
    excerpt: story?.excerpt ?? '',
    content: story?.content ?? '',
    category: story?.category ?? '',
    tags: story?.tags ?? [],
    visibility: story?.visibility ?? 'public',
    allowComments: story?.allowComments ?? true,
    featured: story?.featured ?? false,
    problemStatus: story?.problemStatus ?? '',
  })

  const setField = <K extends keyof FormValues>(
    key: K,
    value: FormValues[K]
  ): void => setValues((current) => ({ ...current, [key]: value }))

  const toggleTag = (slug: string): void =>
    setValues((current) => ({
      ...current,
      tags: current.tags.includes(slug)
        ? current.tags.filter((tag) => tag !== slug)
        : [...current.tags, slug],
    }))

  const submit = (status: StoryStatus): void => {
    startTransition(async () => {
      const input: StoryInput = {
        title: values.title,
        type: values.type,
        status,
        visibility: values.visibility,
        excerpt: values.excerpt || null,
        content: values.content || null,
        coverImage: story?.coverImage ?? null,
        category: values.category || null,
        tags: values.tags,
        allowComments: values.allowComments,
        featured: values.featured,
        problemStatus:
          values.type === 'problem' ? values.problemStatus || null : null,
      }

      const result = story
        ? await updateStory(story.id, input)
        : await createStory(input)

      if (!result.ok) {
        toast.error(result.error ?? 'Something went wrong.')
        return
      }

      toast.success(
        story
          ? 'Story updated.'
          : status === 'published'
            ? 'Story published.'
            : 'Draft saved.'
      )
      router.push('/stories')
    })
  }

  const publishLabel = story?.status === 'published' ? 'Update' : 'Publish'

  return (
    <form
      className="flex max-w-2xl flex-col gap-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="story-title">Title</Label>
        <Input
          id="story-title"
          value={values.title}
          onChange={(event) => setField('title', event.target.value)}
          placeholder="How I built the admin dashboard"
          data-testid="storyTitleInput"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="story-type">Type</Label>
          <select
            id="story-type"
            className={CONTROL}
            value={values.type}
            onChange={(event) =>
              setField('type', event.target.value as StoryType)
            }
            data-testid="storyTypeSelect"
          >
            {STORY_TYPES.map((type) => (
              <option key={type} value={type}>
                {titleCase(type)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="story-visibility">Visibility</Label>
          <select
            id="story-visibility"
            className={CONTROL}
            value={values.visibility}
            onChange={(event) =>
              setField('visibility', event.target.value as StoryVisibility)
            }
            data-testid="storyVisibilitySelect"
          >
            {STORY_VISIBILITIES.map((visibility) => (
              <option key={visibility} value={visibility}>
                {titleCase(visibility)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {values.type === 'problem' && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="story-problem-status">Problem status</Label>
          <select
            id="story-problem-status"
            className={CONTROL}
            value={values.problemStatus}
            onChange={(event) =>
              setField('problemStatus', event.target.value as '' | ProblemStatus)
            }
            data-testid="storyProblemStatusSelect"
          >
            <option value="">Not set</option>
            {PROBLEM_STATUSES.map((status) => (
              <option key={status} value={status}>
                {titleCase(status)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="story-summary">Summary</Label>
        <Textarea
          id="story-summary"
          rows={2}
          value={values.excerpt}
          onChange={(event) => setField('excerpt', event.target.value)}
          placeholder="A short summary shown on cards and previews."
          data-testid="storySummaryInput"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Content</Label>
        <StoryEditor
          initialValue={story?.content ?? ''}
          onChange={(html) => setField('content', html)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="story-category">Category</Label>
        <select
          id="story-category"
          className={CONTROL}
          value={values.category}
          onChange={(event) => setField('category', event.target.value)}
          data-testid="storyCategorySelect"
        >
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Tags</Label>
        {tags.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No tags yet — create some in the Tags section.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2" data-testid="storyTags">
            {tags.map((tag) => {
              const selected = values.tags.includes(tag.slug)
              return (
                <Button
                  key={tag.slug}
                  type="button"
                  variant={selected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleTag(tag.slug)}
                  data-testid="storyTagToggle"
                  data-slug={tag.slug}
                  data-selected={selected}
                >
                  {tag.name}
                </Button>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={values.allowComments}
            onCheckedChange={(checked) =>
              setField('allowComments', checked === true)
            }
            data-testid="storyAllowComments"
          />
          Allow comments
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={values.featured}
            onCheckedChange={(checked) => setField('featured', checked === true)}
            data-testid="storyFeatured"
          />
          Featured
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={() => submit('published')}
          loading={isPending}
          data-testid="storyPublish"
        >
          {publishLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => submit('draft')}
          loading={isPending}
          data-testid="storySaveDraft"
        >
          Save draft
        </Button>
        <Button type="button" variant="ghost" asChild>
          <Link href="/stories">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
