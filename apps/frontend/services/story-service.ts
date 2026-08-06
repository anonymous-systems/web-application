import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
} from 'firebase-admin/firestore'
import { db, resolveProfiles, toIsoString } from '@/lib/firestore'
import { byNewest, publiclyVisible } from '@/lib/public-content'
import { resolveAuthorName } from '@workspace/ui/lib/user-display'
import { UserProfileDoc } from '@workspace/ui/models/interfaces/user-profile'
import { Story } from '@workspace/ui/models/interfaces/story'

const stories = (): CollectionReference => db().collection('stories')

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
    problemStatus:
      (data.problemStatus as Story['problemStatus'] | undefined) ?? null,
    readTimeMinutes: (data.readTimeMinutes as number | undefined) ?? null,
    authorUid: userRef?.id ?? null,
    authorName: resolveAuthorName(profile),
    authorAvatar: profile?.avatar ?? null,
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
    publishedAt: toIsoString(data.publishedAt),
  }
}

/** Published, public stories for the `/stories` index, newest first. */
export const listPublishedStories = async (): Promise<Story[]> => {
  const snapshot = await publiclyVisible(stories()).get()
  const profiles = await resolveProfiles(snapshot.docs)

  return snapshot.docs.map((doc) => toStory(doc, profiles)).sort(byNewest)
}

/**
 * A single published, public story by slug, or null. Slugs are unique within
 * the collection (enforced on write), so the first match is the only match.
 */
export const getPublishedStoryBySlug = async (
  slug: string
): Promise<Story | null> => {
  const snapshot = await publiclyVisible(stories())
    .where('slug', '==', slug)
    .limit(1)
    .get()

  const doc = snapshot.docs[0]
  if (!doc) return null

  const profiles = await resolveProfiles([doc])
  return toStory(doc, profiles)
}
