import { CollectionReference } from 'firebase-admin/firestore'
import { db, resolveProfiles } from '@workspace/firebase-config/firestore'
import { toStory } from '@workspace/firebase-config/documents'
import { byNewest, publiclyVisible } from '@/lib/public-content'
import { Story } from '@workspace/ui/models/interfaces/story'

const stories = (): CollectionReference => db().collection('stories')

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
