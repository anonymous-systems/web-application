import { CollectionReference } from 'firebase-admin/firestore'
import { slugify, uniqueSlug } from '@workspace/ui/lib/slug'

/**
 * A free slug for `title` within `collection`. Read as a prefix range so only the
 * `base…base-N` family is fetched; `excludeId` keeps a document from colliding
 * with itself on update.
 */
export const availableSlug = async (
  collection: CollectionReference,
  title: string,
  excludeId?: string
): Promise<string> => {
  const base = slugify(title)
  if (base === '') return base

  const snapshot = await collection
    .where('slug', '>=', base)
    .where('slug', '<', `${base}￿`)
    .get()

  const taken = snapshot.docs
    .filter((doc) => doc.id !== excludeId)
    .map((doc) => (doc.data().slug as string | undefined) ?? '')

  return uniqueSlug(title, taken)
}
