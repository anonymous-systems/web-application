import {
  CollectionReference,
  FieldValue,
  Timestamp,
} from 'firebase-admin/firestore'
import { db, resolveProfiles } from '@workspace/firebase-config/firestore'
import { toProject } from '@workspace/firebase-config/documents'
import { availableSlug } from '@/lib/available-slug'
import { loadTerms } from '@/lib/terms'
import { termRef, termRefs } from '@/lib/term-refs'
import { UNEXPECTED } from '@/lib/errors'
import { ActionResult } from '@/interfaces/action-result'
import { ProjectWriteFields } from '@/interfaces/project'
import { Project } from '@workspace/ui/models/interfaces/project'
import { ProjectInput, projectInputSchema } from '@workspace/ui/models/schemas/project'

const projects = (): CollectionReference => db().collection('projects')

export const listProjects = async (): Promise<Project[]> => {
  const snapshot = await projects().get()
  const [profiles, terms] = await Promise.all([
    resolveProfiles(snapshot.docs),
    loadTerms(),
  ])

  return snapshot.docs
    .map((doc) => toProject(doc.id, doc.data() ?? {}, profiles, terms))
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
}

export const getProject = async (id: string): Promise<Project | null> => {
  const doc = await projects().doc(id).get()
  if (!doc.exists) return null

  const [profiles, terms] = await Promise.all([
    resolveProfiles([doc]),
    loadTerms(),
  ])

  return toProject(doc.id, doc.data() ?? {}, profiles, terms)
}

// `user`, `roles`, and timestamps are owned by create/update, not the caller.
const writableFields = (
  input: ProjectInput,
  slug: string
): ProjectWriteFields => ({
  title: input.title.trim(),
  slug,
  status: input.status,
  visibility: input.visibility,
  excerpt: input.excerpt?.trim() || null,
  content: input.content || null,
  coverImage: input.coverImage?.trim() || null,
  category: termRef('categories', input.category),
  tags: termRefs('tags', input.tags),
  technologies: termRefs('technologies', input.technologies),
  sourceCodeLink: input.sourceCodeLink ?? null,
  livePreviewLink: input.livePreviewLink ?? null,
  figmaLink: input.figmaLink ?? null,
  developmentStatus: input.developmentStatus ?? null,
  featured: input.featured,
  allowComments: input.allowComments,
})

const firstError = (issues: { message: string }[]): string =>
  issues[0]?.message ?? UNEXPECTED

export const createProject = async (
  input: ProjectInput,
  ownerUid: string
): Promise<ActionResult & { id?: string }> => {
  const parsed = projectInputSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: firstError(parsed.error.issues) }

  try {
    const now = FieldValue.serverTimestamp()
    const ref = await projects().add({
      ...writableFields(
        parsed.data,
        await availableSlug(projects(), parsed.data.title)
      ),
      user: db().doc(`users/${ownerUid}`),
      roles: { [ownerUid]: 'owner' },
      createdAt: now,
      updatedAt: now,
      publishedAt: parsed.data.status === 'published' ? now : null,
    })

    return { ok: true, id: ref.id }
  } catch (error) {
    console.error('Failed to create project', error)
    return { ok: false, error: UNEXPECTED }
  }
}

export const updateProject = async (
  id: string,
  input: ProjectInput
): Promise<ActionResult> => {
  const parsed = projectInputSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: firstError(parsed.error.issues) }

  try {
    const ref = projects().doc(id)
    const existing = await ref.get()
    if (!existing.exists) return { ok: false, error: 'Project not found.' }

    // Stamp publishedAt on the first publish; keep the original thereafter.
    const existingPublishedAt =
      (existing.data()?.publishedAt as Timestamp | undefined) ?? null
    const publishedAt =
      parsed.data.status === 'published' && existingPublishedAt == null
        ? FieldValue.serverTimestamp()
        : existingPublishedAt

    await ref.update({
      ...writableFields(
        parsed.data,
        await availableSlug(projects(), parsed.data.title, id)
      ),
      updatedAt: FieldValue.serverTimestamp(),
      publishedAt,
    })

    return { ok: true }
  } catch (error) {
    console.error('Failed to update project', error)
    return { ok: false, error: UNEXPECTED }
  }
}

export const deleteProject = async (id: string): Promise<ActionResult> => {
  try {
    // Recursive so the project's comments subcollection isn't orphaned.
    await db().recursiveDelete(projects().doc(id))
    return { ok: true }
  } catch (error) {
    console.error('Failed to delete project', error)
    return { ok: false, error: UNEXPECTED }
  }
}
