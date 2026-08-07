import {
  CollectionReference,
  FieldValue,
  Timestamp,
} from 'firebase-admin/firestore'
import { db, resolveProfiles } from '@workspace/firebase-config/firestore'
import { toStory } from '@workspace/firebase-config/documents'
import { availableSlug } from '@/lib/available-slug'
import { UNEXPECTED } from '@/lib/errors'
import { readTimeMinutes } from '@/lib/read-time'
import { ActionResult } from '@/interfaces/action-result'
import { StoryWriteFields } from '@/interfaces/story'
import { Story } from '@workspace/ui/models/interfaces/story'
import { StoryInput, storyInputSchema } from '@workspace/ui/models/schemas/story'

const stories = (): CollectionReference => db().collection('stories')

export const listStories = async (): Promise<Story[]> => {
  const snapshot = await stories().get()
  const profiles = await resolveProfiles(snapshot.docs)

  return snapshot.docs
    .map((doc) => toStory(doc.id, doc.data() ?? {}, profiles))
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
}

export const getStory = async (id: string): Promise<Story | null> => {
  const doc = await stories().doc(id).get()
  if (!doc.exists) return null

  const profiles = await resolveProfiles([doc])
  return toStory(doc.id, doc.data() ?? {}, profiles)
}

// `readTimeMinutes` comes from the content; `user`, `roles`, and timestamps are
// owned by create/update, not the caller.
const writableFields = (input: StoryInput, slug: string): StoryWriteFields => ({
  title: input.title.trim(),
  slug,
  type: input.type,
  status: input.status,
  visibility: input.visibility,
  excerpt: input.excerpt?.trim() || null,
  content: input.content || null,
  coverImage: input.coverImage?.trim() || null,
  category: input.category?.trim() || null,
  tags: input.tags,
  allowComments: input.allowComments,
  featured: input.featured,
  problemStatus: input.problemStatus ?? null,
  readTimeMinutes: readTimeMinutes(input.content ?? null),
})

const firstError = (issues: { message: string }[]): string =>
  issues[0]?.message ?? UNEXPECTED

export const createStory = async (
  input: StoryInput,
  ownerUid: string
): Promise<ActionResult & { id?: string }> => {
  const parsed = storyInputSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: firstError(parsed.error.issues) }

  try {
    const now = FieldValue.serverTimestamp()
    const ref = await stories().add({
      ...writableFields(
        parsed.data,
        await availableSlug(stories(), parsed.data.title)
      ),
      user: db().doc(`users/${ownerUid}`),
      roles: { [ownerUid]: 'owner' },
      createdAt: now,
      updatedAt: now,
      publishedAt: parsed.data.status === 'published' ? now : null,
    })

    return { ok: true, id: ref.id }
  } catch (error) {
    console.error('Failed to create story', error)
    return { ok: false, error: UNEXPECTED }
  }
}

export const updateStory = async (
  id: string,
  input: StoryInput
): Promise<ActionResult> => {
  const parsed = storyInputSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: firstError(parsed.error.issues) }

  try {
    const ref = stories().doc(id)
    const existing = await ref.get()
    if (!existing.exists) return { ok: false, error: 'Story not found.' }

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
        await availableSlug(stories(), parsed.data.title, id)
      ),
      updatedAt: FieldValue.serverTimestamp(),
      publishedAt,
    })

    return { ok: true }
  } catch (error) {
    console.error('Failed to update story', error)
    return { ok: false, error: UNEXPECTED }
  }
}

export const deleteStory = async (id: string): Promise<ActionResult> => {
  try {
    // Recursive so the story's comments subcollection isn't orphaned.
    await db().recursiveDelete(stories().doc(id))
    return { ok: true }
  } catch (error) {
    console.error('Failed to delete story', error)
    return { ok: false, error: UNEXPECTED }
  }
}
