import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  FieldValue,
  getFirestore,
  Timestamp,
} from 'firebase-admin/firestore'
import { getFirebaseAdminApp } from '@/lib/firebase-admin'
import { toIsoString } from '@/lib/firestore'
import { resolveAuthorName } from '@/lib/user-display'
import { readTimeMinutes } from '@/lib/read-time'
import { UserProfileDoc } from '@/interfaces/user-profile'
import { ActionResult } from '@/interfaces/action-result'
import { slugify } from '@workspace/ui/lib/slug'
import { Story } from '@workspace/ui/models/interfaces/story'
import { StoryInput, storyInputSchema } from '@workspace/ui/models/schemas/story'

const UNEXPECTED = 'Something went wrong. Please try again.'

const db = () => getFirestore(getFirebaseAdminApp())
const stories = (): CollectionReference => db().collection('stories')

const resolveProfiles = async (
  docs: DocumentSnapshot[]
): Promise<Map<string, UserProfileDoc>> => {
  const refs = new Map<string, DocumentReference>()
  for (const doc of docs) {
    const userRef = doc.data()?.user as DocumentReference | undefined
    if (userRef?.id) refs.set(userRef.id, userRef)
  }

  const profiles = new Map<string, UserProfileDoc>()
  if (refs.size === 0) return profiles

  const snaps = await db().getAll(...refs.values())
  snaps.forEach((snap) => {
    if (snap.exists) profiles.set(snap.id, snap.data() as UserProfileDoc)
  })
  return profiles
}

// Every field is read defensively so legacy/partial documents never throw.
const toStory = (
  doc: DocumentSnapshot,
  profiles: Map<string, UserProfileDoc>
): Story => {
  const data = doc.data() ?? {}
  const userRef = data.user as DocumentReference | undefined
  const profile = userRef?.id ? profiles.get(userRef.id) : undefined

  return {
    id: doc.id,
    title: (data.title as string | undefined) ?? '',
    slug: (data.slug as string | undefined) ?? '',
    type: (data.type as Story['type'] | undefined) ?? 'article',
    status: (data.status as Story['status'] | undefined) ?? 'draft',
    visibility: (data.visibility as Story['visibility'] | undefined) ?? 'public',
    excerpt: (data.excerpt as string | undefined) ?? null,
    content: (data.content as string | undefined) ?? null,
    coverImage: (data.coverImage as string | undefined) ?? null,
    category: (data.category as string | undefined) ?? null,
    tags: (data.tags as string[] | undefined) ?? [],
    allowComments: (data.allowComments as boolean | undefined) ?? true,
    featured: (data.featured as boolean | undefined) ?? false,
    problemStatus: (data.problemStatus as Story['problemStatus'] | undefined) ?? null,
    readTimeMinutes: (data.readTimeMinutes as number | undefined) ?? null,
    authorUid: userRef?.id ?? null,
    authorName: resolveAuthorName(profile),
    authorAvatar: profile?.avatar ?? null,
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
    publishedAt: toIsoString(data.publishedAt),
  }
}

export const listStories = async (): Promise<Story[]> => {
  const snapshot = await stories().get()
  const profiles = await resolveProfiles(snapshot.docs)

  return snapshot.docs
    .map((doc) => toStory(doc, profiles))
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
}

export const getStory = async (id: string): Promise<Story | null> => {
  const doc = await stories().doc(id).get()
  if (!doc.exists) return null

  const profiles = await resolveProfiles([doc])
  return toStory(doc, profiles)
}

// The document fields derived from validated user input. `slug` comes from the
// title and `readTimeMinutes` from the content; `user`, `roles`, and timestamps
// are owned by create/update, not the caller.
const writableFields = (input: StoryInput) => ({
  title: input.title.trim(),
  slug: slugify(input.title),
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
      ...writableFields(parsed.data),
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
      ...writableFields(parsed.data),
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
