import { getDocs, limit, query, where } from 'firebase/firestore'
import { withServerFirestore } from '@workspace/firebase-config/server-firestore'
import { toProject } from '@workspace/firebase-config/documents'
import { byNewest, publiclyVisible } from '@/lib/public-content'
import { resolveProfiles } from '@/lib/profiles'
import { loadTerms } from '@/lib/terms'
import { Project } from '@workspace/ui/models/interfaces/project'

/** Published, public projects for the `/portfolio` index, newest first. */
export const listPublishedProjects = async (): Promise<Project[]> =>
  withServerFirestore(async (firestore) => {
    const snapshot = await getDocs(publiclyVisible(firestore, 'projects'))
    const [profiles, terms] = await Promise.all([
      resolveProfiles(
        firestore,
        snapshot.docs.map((document) => document.data())
      ),
      loadTerms(firestore),
    ])

    return snapshot.docs
      .map((document) => toProject(document.id, document.data(), profiles, terms))
      .sort(byNewest)
  })

/**
 * A single published, public project by slug, or null. Slugs are unique within
 * the collection (enforced on write), so the first match is the only match.
 */
export const getPublishedProjectBySlug = async (
  slug: string
): Promise<Project | null> =>
  withServerFirestore(async (firestore) => {
    const snapshot = await getDocs(
      query(publiclyVisible(firestore, 'projects'), where('slug', '==', slug), limit(1))
    )

    const document = snapshot.docs[0]
    if (!document) return null

    const [profiles, terms] = await Promise.all([
      resolveProfiles(firestore, [document.data()]),
      loadTerms(firestore),
    ])

    return toProject(document.id, document.data(), profiles, terms)
  })
