import { CollectionReference } from 'firebase-admin/firestore'
import { db, resolveProfiles } from '@workspace/firebase-config/firestore'
import { toProject } from '@workspace/firebase-config/documents'
import { byNewest, publiclyVisible } from '@/lib/public-content'
import { Project } from '@workspace/ui/models/interfaces/project'

const projects = (): CollectionReference => db().collection('projects')

/** Published, public projects for the `/portfolio` index, newest first. */
export const listPublishedProjects = async (): Promise<Project[]> => {
  const snapshot = await publiclyVisible(projects()).get()
  const profiles = await resolveProfiles(snapshot.docs)

  return snapshot.docs.map((doc) => toProject(doc, profiles)).sort(byNewest)
}

/**
 * A single published, public project by slug, or null. Slugs are unique within
 * the collection (enforced on write), so the first match is the only match.
 */
export const getPublishedProjectBySlug = async (
  slug: string
): Promise<Project | null> => {
  const snapshot = await publiclyVisible(projects())
    .where('slug', '==', slug)
    .limit(1)
    .get()

  const doc = snapshot.docs[0]
  if (!doc) return null

  const profiles = await resolveProfiles([doc])
  return toProject(doc, profiles)
}
