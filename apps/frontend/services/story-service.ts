import { getDocs, limit, query, where } from 'firebase/firestore'
import { withServerFirestore } from '@workspace/firebase-config/server-firestore'
import { toStory } from '@workspace/firebase-config/documents'
import { byNewest, publiclyVisible } from '@/lib/public-content'
import { resolveProfiles } from '@/lib/profiles'
import { loadTerms } from '@/lib/terms'
import { Story } from '@workspace/ui/models/interfaces/story'

/** Published, public stories for the `/stories` index, newest first. */
export const listPublishedStories = async (): Promise<Story[]> =>
  withServerFirestore(async (firestore) => {
    const snapshot = await getDocs(publiclyVisible(firestore, 'stories'))
    const [profiles, terms] = await Promise.all([
      resolveProfiles(
        firestore,
        snapshot.docs.map((document) => document.data())
      ),
      loadTerms(firestore),
    ])

    return snapshot.docs
      .map((document) => toStory(document.id, document.data(), profiles, terms))
      .sort(byNewest)
  })

/**
 * A single published, public story by slug, or null. Slugs are unique within
 * the collection (enforced on write), so the first match is the only match.
 */
export const getPublishedStoryBySlug = async (
  slug: string
): Promise<Story | null> =>
  withServerFirestore(async (firestore) => {
    const snapshot = await getDocs(
      query(publiclyVisible(firestore, 'stories'), where('slug', '==', slug), limit(1))
    )

    const document = snapshot.docs[0]
    if (!document) return null

    const [profiles, terms] = await Promise.all([
      resolveProfiles(firestore, [document.data()]),
      loadTerms(firestore),
    ])

    return toStory(document.id, document.data(), profiles, terms)
  })
