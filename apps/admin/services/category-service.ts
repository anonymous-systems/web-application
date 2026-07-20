import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { getFirebaseAdminApp } from '@/lib/firebase-admin'
import { Category } from '@/interfaces/category'

const toIsoString = (value: unknown): string | null =>
  value instanceof Timestamp ? value.toDate().toISOString() : null

/**
 * Lists categories for the admin Categories section, ordered by name.
 * Server-only (Admin SDK).
 */
export const listCategories = async (): Promise<Category[]> => {
  const snapshot = await getFirestore(getFirebaseAdminApp())
    .collection('categories')
    .orderBy('name')
    .get()

  return snapshot.docs.map((doc): Category => {
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
}
