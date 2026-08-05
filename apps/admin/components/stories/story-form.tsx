'use client'

import { ChangeEvent, JSX, useState, useTransition } from 'react'
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
import { titleCase } from '@/lib/text'
import { SelectField } from '@/components/form/select-field'
import {
  createStory,
  updateStory,
  uploadStoryCover,
} from '@/app/(dashboard)/stories/actions'

// CKEditor touches `window`, so it's loaded client-only.
const RichTextEditor = dynamic(
  () =>
    import('../editor/rich-text-editor').then(
      (module) => module.RichTextEditor
    ),
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
  coverImage: string
  category: string
  tags: string[]
  visibility: StoryVisibility
  allowComments: boolean
  featured: boolean
  problemStatus: '' | ProblemStatus
}

export const StoryForm = ({ story, categories, tags }: Props): JSX.Element => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isUploading, startUpload] = useTransition()

  const [values, setValues] = useState<FormValues>({
    title: story?.title ?? '',
    type: story?.type ?? 'article',
    excerpt: story?.excerpt ?? '',
    content: story?.content ?? '',
    coverImage: story?.coverImage ?? '',
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

  const uploadCover = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    event.target.value = '' // allow re-selecting the same file after removing
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    startUpload(async () => {
      const result = await uploadStoryCover(formData)
      if (!result.ok || !result.url) {
        toast.error(result.error ?? 'Something went wrong.')
        return
      }
      setField('coverImage', result.url)
      toast.success('Cover uploaded.')
    })
  }

  const submit = (status: StoryStatus): void => {
    startTransition(async () => {
      const input: StoryInput = {
        title: values.title,
        type: values.type,
        status,
        visibility: values.visibility,
        excerpt: values.excerpt || null,
        content: values.content || null,
        coverImage: values.coverImage || null,
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
        <SelectField
          id="story-type"
          label="Type"
          value={values.type}
          onChange={(value) => setField('type', value as StoryType)}
          options={STORY_TYPES.map((type) => ({
            value: type,
            label: titleCase(type),
          }))}
          testId="storyTypeSelect"
        />

        <SelectField
          id="story-visibility"
          label="Visibility"
          value={values.visibility}
          onChange={(value) => setField('visibility', value as StoryVisibility)}
          options={STORY_VISIBILITIES.map((visibility) => ({
            value: visibility,
            label: titleCase(visibility),
          }))}
          testId="storyVisibilitySelect"
        />
      </div>

      {values.type === 'problem' && (
        <SelectField
          id="story-problem-status"
          label="Problem status"
          value={values.problemStatus}
          onChange={(value) =>
            setField('problemStatus', value as '' | ProblemStatus)
          }
          options={PROBLEM_STATUSES.map((status) => ({
            value: status,
            label: titleCase(status),
          }))}
          noneLabel="Not set"
          testId="storyProblemStatusSelect"
        />
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
        <RichTextEditor
          initialValue={story?.content ?? ''}
          onChange={(html) => setField('content', html)}
          dataTestId="storyContentEditor"
        />
      </div>

      <SelectField
        id="story-category"
        label="Category"
        value={values.category}
        onChange={(value) => setField('category', value)}
        options={categories.map((category) => ({
          value: category.slug,
          label: category.name,
        }))}
        noneLabel="No category"
        testId="storyCategorySelect"
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="story-cover">Cover image</Label>
        {values.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element -- dynamic external cover URL
          <img
            src={values.coverImage}
            alt="Cover preview"
            className="h-28 w-full max-w-xs rounded-md border object-cover"
            data-testid="storyCoverPreview"
          />
        )}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            id="story-cover"
            type="file"
            accept="image/*"
            onChange={uploadCover}
            disabled={isUploading}
            data-testid="storyCoverFile"
          />
          {values.coverImage && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setField('coverImage', '')}
              data-testid="storyCoverRemove"
            >
              Remove
            </Button>
          )}
        </div>
        <Input
          type="url"
          value={values.coverImage}
          onChange={(event) => setField('coverImage', event.target.value)}
          placeholder="…or paste an image URL"
          data-testid="storyCoverUrl"
        />
        {isUploading && (
          <p className="text-xs text-muted-foreground">Uploading…</p>
        )}
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
