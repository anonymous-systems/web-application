import type { DocumentReference, DocumentSnapshot } from 'firebase-admin/firestore'
import { toIsoString } from './firestore'
import { resolveAuthorName } from '@workspace/ui/lib/user-display'
import type { UserProfileDoc } from '@workspace/ui/models/interfaces/user-profile'
import type { Story } from '@workspace/ui/models/interfaces/story'
import type { Project } from '@workspace/ui/models/interfaces/project'

/**
 * Firestore document → display model, mapped in exactly one place so a field
 * added to the model cannot be missed on one surface and read as null there.
 *
 * Every field is read defensively so legacy and partially-migrated documents
 * never throw — the collections still hold pre-migration shapes.
 */
export const toStory = (
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

/** Firestore document → display model. See toStory for the shared rationale. */
export const toProject = (
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
