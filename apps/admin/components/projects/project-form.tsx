'use client'

import { ChangeEvent, JSX, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from '@workspace/ui/components/sonner'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'
import { Label } from '@workspace/ui/components/label'
import { Button } from '@workspace/ui/components/custom/button'
import {
  PROJECT_DEVELOPMENT_STATUS_LABELS,
  PROJECT_DEVELOPMENT_STATUSES,
  PROJECT_VISIBILITIES,
  ProjectDevelopmentStatus,
  ProjectStatus,
  ProjectVisibility,
} from '@workspace/ui/models/project-constants'
import { ProjectInput } from '@workspace/ui/models/schemas/project'
import { Project } from '@workspace/ui/models/interfaces/project'
import { titleCase } from '@/lib/text'
import { SelectField } from '@/components/form/select-field'
import { TermChips } from '@/components/form/term-chips'
import { CoverImageField } from '@/components/form/cover-image-field'
import { CheckboxField } from '@/components/form/checkbox-field'
import { RichTextEditor } from '@/components/form/rich-text-editor'
import { TermOption } from '@/interfaces/term-option'
import {
  createProject,
  updateProject,
  uploadProjectCover,
} from '@/app/(dashboard)/projects/actions'

interface Props {
  /** Present when editing; omitted when creating. */
  project?: Project
  categories: TermOption[]
  tags: TermOption[]
  technologies: TermOption[]
}

type ChipField = 'tags' | 'technologies'

interface FormValues {
  title: string
  visibility: ProjectVisibility
  developmentStatus: '' | ProjectDevelopmentStatus
  excerpt: string
  content: string
  coverImage: string
  category: string
  tags: string[]
  technologies: string[]
  sourceCodeLink: string
  livePreviewLink: string
  figmaLink: string
  allowComments: boolean
  featured: boolean
}

export const ProjectForm = ({
  project,
  categories,
  tags,
  technologies,
}: Props): JSX.Element => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isUploading, startUpload] = useTransition()

  const [values, setValues] = useState<FormValues>({
    title: project?.title ?? '',
    visibility: project?.visibility ?? 'public',
    developmentStatus: project?.developmentStatus ?? '',
    excerpt: project?.excerpt ?? '',
    content: project?.content ?? '',
    coverImage: project?.coverImage ?? '',
    category: project?.category?.id ?? '',
    tags: project?.tags.map((tag) => tag.id) ?? [],
    technologies: project?.technologies.map((tech) => tech.id) ?? [],
    sourceCodeLink: project?.sourceCodeLink ?? '',
    livePreviewLink: project?.livePreviewLink ?? '',
    figmaLink: project?.figmaLink ?? '',
    allowComments: project?.allowComments ?? true,
    featured: project?.featured ?? false,
  })

  const setField = <K extends keyof FormValues>(
    key: K,
    value: FormValues[K]
  ): void => setValues((current) => ({ ...current, [key]: value }))

  const toggleChip = (key: ChipField, id: string): void =>
    setValues((current) => ({
      ...current,
      [key]: current[key].includes(id)
        ? current[key].filter((value) => value !== id)
        : [...current[key], id],
    }))

  const uploadCover = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    event.target.value = '' // allow re-selecting the same file after removing
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    startUpload(async () => {
      const result = await uploadProjectCover(formData)
      if (!result.ok || !result.url) {
        toast.error(result.error ?? 'Something went wrong.')
        return
      }
      setField('coverImage', result.url)
      toast.success('Cover uploaded.')
    })
  }

  const submit = (status: ProjectStatus): void => {
    startTransition(async () => {
      const input: ProjectInput = {
        title: values.title,
        status,
        visibility: values.visibility,
        excerpt: values.excerpt || null,
        content: values.content || null,
        coverImage: values.coverImage || null,
        category: values.category || null,
        tags: values.tags,
        technologies: values.technologies,
        sourceCodeLink: values.sourceCodeLink || null,
        livePreviewLink: values.livePreviewLink || null,
        figmaLink: values.figmaLink || null,
        developmentStatus: values.developmentStatus || null,
        allowComments: values.allowComments,
        featured: values.featured,
      }

      const result = project
        ? await updateProject(project.id, input)
        : await createProject(input)

      if (!result.ok) {
        toast.error(result.error ?? 'Something went wrong.')
        return
      }

      toast.success(
        project
          ? 'Project updated.'
          : status === 'published'
            ? 'Project published.'
            : status === 'archived'
              ? 'Project archived.'
              : 'Draft saved.'
      )
      router.push('/projects')
    })
  }

  const publishLabel = project?.status === 'published' ? 'Update' : 'Publish'

  return (
    <form
      className="flex max-w-2xl flex-col gap-5"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="project-title">Name</Label>
        <Input
          id="project-title"
          value={values.title}
          onChange={(event) => setField('title', event.target.value)}
          placeholder="Anonymous Systems admin dashboard"
          data-testid="projectTitleInput"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          id="project-visibility"
          label="Visibility"
          value={values.visibility}
          onChange={(value) => setField('visibility', value as ProjectVisibility)}
          options={PROJECT_VISIBILITIES.map((visibility) => ({
            value: visibility,
            label: titleCase(visibility),
          }))}
          testId="projectVisibilitySelect"
        />

        <SelectField
          id="project-development-status"
          label="Development status"
          value={values.developmentStatus}
          onChange={(value) =>
            setField('developmentStatus', value as '' | ProjectDevelopmentStatus)
          }
          options={PROJECT_DEVELOPMENT_STATUSES.map((status) => ({
            value: status,
            label: PROJECT_DEVELOPMENT_STATUS_LABELS[status],
          }))}
          noneLabel="Not set"
          testId="projectDevStatusSelect"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="project-summary">Summary</Label>
        <Textarea
          id="project-summary"
          rows={2}
          value={values.excerpt}
          onChange={(event) => setField('excerpt', event.target.value)}
          placeholder="A short description shown on cards and previews."
          data-testid="projectSummaryInput"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Content</Label>
        <RichTextEditor
          initialValue={project?.content ?? ''}
          onChange={(html) => setField('content', html)}
          dataTestId="projectContentEditor"
        />
      </div>

      <SelectField
        id="project-category"
        label="Category"
        value={values.category}
        onChange={(value) => setField('category', value)}
        options={categories.map((category) => ({
          value: category.id,
          label: category.name,
        }))}
        noneLabel="No category"
        testId="projectCategorySelect"
      />

      <CoverImageField
        id="project-cover"
        value={values.coverImage}
        onChange={(url) => setField('coverImage', url)}
        onUpload={uploadCover}
        isUploading={isUploading}
        testIdPrefix="project"
      />

      <div className="flex flex-col gap-2">
        <Label>Tags</Label>
        <TermChips
          terms={tags}
          selected={values.tags}
          onToggle={(id) => toggleChip('tags', id)}
          section="tags"
          groupTestId="projectTags"
          toggleTestId="projectTagToggle"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Technologies</Label>
        <TermChips
          terms={technologies}
          selected={values.technologies}
          onToggle={(id) => toggleChip('technologies', id)}
          section="technologies"
          groupTestId="projectTechnologies"
          toggleTestId="projectTechToggle"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="project-source">Source code link</Label>
          <Input
            id="project-source"
            type="url"
            value={values.sourceCodeLink}
            onChange={(event) => setField('sourceCodeLink', event.target.value)}
            placeholder="https://github.com/…"
            data-testid="projectSourceLink"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="project-demo">Live demo link</Label>
          <Input
            id="project-demo"
            type="url"
            value={values.livePreviewLink}
            onChange={(event) => setField('livePreviewLink', event.target.value)}
            placeholder="https://…"
            data-testid="projectDemoLink"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="project-figma">Figma link</Label>
          <Input
            id="project-figma"
            type="url"
            value={values.figmaLink}
            onChange={(event) => setField('figmaLink', event.target.value)}
            placeholder="https://figma.com/…"
            data-testid="projectFigmaLink"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <CheckboxField
          label="Allow comments"
          checked={values.allowComments}
          onChange={(checked) => setField('allowComments', checked)}
          testId="projectAllowComments"
        />
        <CheckboxField
          label="Featured"
          checked={values.featured}
          onChange={(checked) => setField('featured', checked)}
          testId="projectFeatured"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={() => submit('published')}
          loading={isPending}
          data-testid="projectPublish"
        >
          {publishLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => submit('draft')}
          loading={isPending}
          data-testid="projectSaveDraft"
        >
          Save draft
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => submit('archived')}
          loading={isPending}
          data-testid="projectArchive"
        >
          Archive
        </Button>
        <Button type="button" variant="ghost" asChild>
          <Link href="/projects">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
