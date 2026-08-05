import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  FieldValue,
  Timestamp,
} from 'firebase-admin/firestore'
import { db, resolveProfiles, toIsoString } from '@/lib/firestore'
import { availableSlug } from '@/lib/available-slug'
import { UNEXPECTED } from '@/lib/errors'
import { resolveAuthorName } from '@/lib/user-display'
import { UserProfileDoc } from '@/interfaces/user-profile'
import { ActionResult } from '@/interfaces/action-result'
import { ProjectWriteFields } from '@/interfaces/project'
import { Project } from '@workspace/ui/models/interfaces/project'
import { ProjectInput, projectInputSchema } from '@workspace/ui/models/schemas/project'

const projects = (): CollectionReference => db().collection('projects')

// Every field is read defensively so legacy/partial documents never throw.
const toProject = (
  doc: DocumentSnapshot,
  profiles: Map<string, UserProfileDoc>
): Project => {
  const data = doc.data() ?? {}
  const userRef = data.user as DocumentReference | undefined
  const profile = userRef?.id ? profiles.get(userRef.id) : undefined

  return {
    id: doc.id,
    title: (data.title as string | undefined) ?? '',
    slug: (data.slug as string | undefined) ?? '',
    status: (data.status as Project['status'] | undefined) ?? 'draft',
    visibility: (data.visibility as Project['visibility'] | undefined) ?? 'public',
    excerpt: (data.excerpt as string | undefined) ?? null,
    content: (data.content as string | undefined) ?? null,
    coverImage: (data.coverImage as string | undefined) ?? null,
    category: (data.category as string | undefined) ?? null,
    tags: (data.tags as string[] | undefined) ?? [],
    technologies: (data.technologies as string[] | undefined) ?? [],
    sourceCodeLink: (data.sourceCodeLink as string | undefined) ?? null,
    livePreviewLink: (data.livePreviewLink as string | undefined) ?? null,
    figmaLink: (data.figmaLink as string | undefined) ?? null,
    developmentStatus:
      (data.developmentStatus as Project['developmentStatus'] | undefined) ?? null,
    featured: (data.featured as boolean | undefined) ?? false,
    allowComments: (data.allowComments as boolean | undefined) ?? true,
    authorUid: userRef?.id ?? null,
    authorName: resolveAuthorName(profile),
    authorAvatar: profile?.avatar ?? null,
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
    publishedAt: toIsoString(data.publishedAt),
  }
}

export const listProjects = async (): Promise<Project[]> => {
  const snapshot = await projects().get()
  const profiles = await resolveProfiles(snapshot.docs)

  return snapshot.docs
    .map((doc) => toProject(doc, profiles))
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
}

export const getProject = async (id: string): Promise<Project | null> => {
  const doc = await projects().doc(id).get()
  if (!doc.exists) return null

  const profiles = await resolveProfiles([doc])
  return toProject(doc, profiles)
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
  category: input.category?.trim() || null,
  tags: input.tags,
  technologies: input.technologies,
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
