import { DocumentReference } from 'firebase-admin/firestore'
import { db } from '@workspace/firebase-config/firestore'
import { TaxonomyCollection } from '@/interfaces/taxonomy'

/**
 * A taxonomy term id as the reference stored on a story or project.
 *
 * Content points at the term document rather than holding a copy of its slug:
 * the term owns its own name and slug, so renaming one can no longer strand
 * content on a slug that nothing answers to.
 */
export const termRef = (
  collection: TaxonomyCollection,
  id: string | null | undefined
): DocumentReference | null => (id ? db().collection(collection).doc(id) : null)

export const termRefs = (
  collection: TaxonomyCollection,
  ids: string[]
): DocumentReference[] => ids.map((id) => db().collection(collection).doc(id))
