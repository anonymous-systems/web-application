import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
} from 'firebase-admin/firestore'
import { db, resolveProfiles, toIsoString } from '@/lib/firestore'
import { byNewest, publiclyVisible } from '@/lib/public-content'
import { resolveAuthorName } from '@workspace/ui/lib/user-display'
import { UserProfileDoc } from '@workspace/ui/models/interfaces/user-profile'
import { Project } from '@workspace/ui/models/interfaces/project'

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
    visibility:
      (data.visibility as Project['visibility'] | undefined) ?? 'public',
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
      (data.developmentStatus as Project['developmentStatus'] | undefined) ??
      null,
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
