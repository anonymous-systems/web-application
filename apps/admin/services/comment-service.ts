import { DocumentReference } from 'firebase-admin/firestore'
import { db, toIsoString, toProfileMap } from '@workspace/firebase-config/firestore'
import { UNEXPECTED } from '@/lib/errors'
import { resolveAuthorName } from '@workspace/ui/lib/user-display'
import { AdminComment, CommentParentType } from '@/interfaces/comment'
import { ActionResult } from '@/interfaces/action-result'

const COLLECTION_FOR: Record<CommentParentType, string> = {
  story: 'stories',
  project: 'projects',
}

// A comment's parent is a story or project; its grandparent is the top-level
// collection the comment was left under.
const parentTypeOf = (parent: DocumentReference | null): CommentParentType =>
  parent?.parent.id === COLLECTION_FOR.project ? 'project' : 'story'

/**
 * Lists every comment across all stories and projects for the moderation view.
 * Server-only (Admin SDK), which bypasses the collection-group read rules.
 * Authors and parent titles are each resolved in a single batched read, and
 * comments are sorted newest-first in memory so no collection-group ordering
 * index is required.
 */
export const listComments = async (): Promise<AdminComment[]> => {
  const firestore = db()
  const snapshot = await firestore.collectionGroup('comments').get()

  // Collect the unique author and parent references (keyed by full path, since a
  // story and project could share an id) so each is read only once.
  const userRefs = new Map<string, DocumentReference>()
  const parentRefs = new Map<string, DocumentReference>()

  for (const doc of snapshot.docs) {
    const userRef = doc.data().user as DocumentReference | undefined
    if (userRef?.id) userRefs.set(userRef.id, userRef)

    const parentRef = doc.ref.parent.parent
    if (parentRef) parentRefs.set(parentRef.path, parentRef)
  }

  const [userSnaps, parentSnaps, reportSnaps] = await Promise.all([
    userRefs.size ? firestore.getAll(...userRefs.values()) : Promise.resolve([]),
    parentRefs.size ? firestore.getAll(...parentRefs.values()) : Promise.resolve([]),
    // One collection-group query for every open report, rather than a count per
    // comment: the moderation table would otherwise be an N+1 on each load.
    firestore.collectionGroup('reports').where('status', '==', 'open').get(),
  ])

  // Keyed by the reported comment's full path, since ids repeat across parents.
  const openReports = new Map<string, number>()
  reportSnaps.docs.forEach((report) => {
    const commentPath = report.ref.parent.parent?.path
    if (commentPath) {
      openReports.set(commentPath, (openReports.get(commentPath) ?? 0) + 1)
    }
  })

  const profiles = toProfileMap(userSnaps)

  const parentTitles = new Map<string, string>()
  parentSnaps.forEach((snap) => {
    const title = snap.data()?.title as string | undefined
    if (title) parentTitles.set(snap.ref.path, title)
  })

  return snapshot.docs
    .map((doc): AdminComment => {
      const data = doc.data()
      const userRef = data.user as DocumentReference | undefined
      const parentRef = doc.ref.parent.parent
      const profile = userRef?.id ? profiles.get(userRef.id) : undefined

      return {
        id: doc.id,
        parentType: parentTypeOf(parentRef),
        parentId: parentRef?.id ?? '',
        parentTitle: parentRef ? (parentTitles.get(parentRef.path) ?? null) : null,
        content: (data.content as string | undefined) ?? '',
        authorUid: userRef?.id ?? null,
        authorName: resolveAuthorName(profile),
        authorUsername: profile?.username ?? null,
        authorAvatar: profile?.avatar ?? null,
        createdAt: toIsoString(data.createdAt),
        openReports: openReports.get(doc.ref.path) ?? 0,
      }
    })
    // Reported comments first — the table is a moderation queue, and a report
    // sitting below a week of ordinary chatter is a report nobody actions.
    .sort(
      (a, b) =>
        b.openReports - a.openReports ||
        (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
    )
}

/**
 * Marks every open report on a comment as reviewed, clearing it from the queue
 * without deleting the comment — the moderator's "this is fine" outcome.
 * Reports are kept rather than removed so a repeat offender's history survives.
 */
export const dismissReports = async (
  parentType: CommentParentType,
  parentId: string,
  id: string
): Promise<ActionResult> => {
  try {
    const reports = await db()
      .collection(COLLECTION_FOR[parentType])
      .doc(parentId)
      .collection('comments')
      .doc(id)
      .collection('reports')
      .where('status', '==', 'open')
      .get()

    const batch = db().batch()
    reports.docs.forEach((report) =>
      batch.update(report.ref, { status: 'reviewed' })
    )
    await batch.commit()

    return { ok: true }
  } catch (error) {
    console.error('Failed to dismiss reports', error)
    return { ok: false, error: UNEXPECTED }
  }
}

export const deleteComment = async (
  parentType: CommentParentType,
  parentId: string,
  id: string
): Promise<ActionResult> => {
  try {
    // Recursive so the comment's reactions subcollection isn't orphaned —
    // deleting a document leaves its subcollections behind, and orphaned
    // reactions would reattach to any comment later given the same id.
    await db().recursiveDelete(
      db()
        .collection(COLLECTION_FOR[parentType])
        .doc(parentId)
        .collection('comments')
        .doc(id)
    )

    return { ok: true }
  } catch (error) {
    console.error('Failed to delete comment', error)
    return { ok: false, error: UNEXPECTED }
  }
}
