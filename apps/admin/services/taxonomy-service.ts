import { CollectionReference, FieldValue } from 'firebase-admin/firestore'
import { db, toIsoString } from '@workspace/firebase-config/firestore'
import { UNEXPECTED } from '@/lib/errors'
import { slugify } from '@workspace/ui/lib/slug'
import { validateTaxonomyInput } from '@/lib/taxonomy'
import { TaxonomyCollection, TaxonomyTerm } from '@/interfaces/taxonomy'
import { ActionResult } from '@/interfaces/action-result'

const SINGULAR: Record<TaxonomyCollection, string> = {
  categories: 'category',
  tags: 'tag',
  technologies: 'technology',
}

const terms = (collection: TaxonomyCollection): CollectionReference =>
  db().collection(collection)

/** Slugs identify a term publicly, so they must stay unique within a collection. */
const isSlugTaken = async (
  collection: TaxonomyCollection,
  slug: string,
  excludeId?: string
): Promise<boolean> => {
  const snapshot = await terms(collection).where('slug', '==', slug).get()

  return snapshot.docs.some((doc) => doc.id !== excludeId)
}

/**
 * Every term in a collection, sorted by name.
 *
 * Sorted in memory rather than with `orderBy('name')`: Firestore silently omits
 * documents missing the ordered field, so an unmigrated term simply vanished
 * from this list. That hid the unmigrated taxonomy collections for months — the
 * dashboard counted 12 tags while this returned 4, and in prod 78 against 0. A
 * term with no name should look wrong, not be invisible.
 */
export const listTerms = async (
  collection: TaxonomyCollection
): Promise<TaxonomyTerm[]> => {
  const snapshot = await terms(collection).get()

  return snapshot.docs
    .map((doc): TaxonomyTerm => {
      const data = doc.data()

      return {
        id: doc.id,
        name: (data.name as string | undefined) ?? '',
        slug: (data.slug as string | undefined) ?? '',
        description: (data.description as string | undefined) ?? null,
        createdAt: toIsoString(data.createdAt),
        updatedAt: toIsoString(data.updatedAt),
      }
    })
    // Unnamed terms sort first rather than last: they are the ones needing
    // attention, and burying them at the bottom is how they went unnoticed.
    .sort((a, b) => Number(Boolean(a.name)) - Number(Boolean(b.name)) || a.name.localeCompare(b.name))
}

export const createTerm = async (
  collection: TaxonomyCollection,
  name: string,
  description: string
): Promise<ActionResult> => {
  const validation = validateTaxonomyInput({ name, description })
  if (!validation.valid) return { ok: false, error: validation.error }

  const slug = slugify(name)

  try {
    if (await isSlugTaken(collection, slug)) {
      return {
        ok: false,
        error: `A ${SINGULAR[collection]} with a similar name already exists.`,
      }
    }

    await terms(collection).add({
      name: name.trim(),
      slug,
      description: description.trim() || null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    return { ok: true }
  } catch (error) {
    console.error(`Failed to create ${SINGULAR[collection]}`, error)
    return { ok: false, error: UNEXPECTED }
  }
}

export const updateTerm = async (
  collection: TaxonomyCollection,
  id: string,
  name: string,
  description: string
): Promise<ActionResult> => {
  const validation = validateTaxonomyInput({ name, description })
  if (!validation.valid) return { ok: false, error: validation.error }

  const slug = slugify(name)

  try {
    if (await isSlugTaken(collection, slug, id)) {
      return {
        ok: false,
        error: `A ${SINGULAR[collection]} with a similar name already exists.`,
      }
    }

    await terms(collection).doc(id).update({
      name: name.trim(),
      slug,
      description: description.trim() || null,
      updatedAt: FieldValue.serverTimestamp(),
    })

    return { ok: true }
  } catch (error) {
    console.error(`Failed to update ${SINGULAR[collection]}`, error)
    return { ok: false, error: UNEXPECTED }
  }
}

export const deleteTerm = async (
  collection: TaxonomyCollection,
  id: string
): Promise<ActionResult> => {
  try {
    await terms(collection).doc(id).delete()

    return { ok: true }
  } catch (error) {
    console.error(`Failed to delete ${SINGULAR[collection]}`, error)
    return { ok: false, error: UNEXPECTED }
  }
}
