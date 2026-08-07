import { collection, getDocs, type Firestore } from 'firebase/firestore'
import type { TaxonomyTermRef } from '@workspace/ui/models/interfaces/taxonomy-term-ref'

const COLLECTIONS = ['categories', 'tags', 'technologies'] as const

/**
 * Every taxonomy term, keyed by **both id and slug**.
 *
 * Keyed twice on purpose: content links by id after the reference migration and
 * by slug before it, so a half-migrated collection still renders. The three
 * collections are small and world-readable, so loading them whole costs less
 * than resolving links one at a time.
 */
export const loadTerms = async (
  firestore: Firestore
): Promise<Map<string, TaxonomyTermRef>> => {
  const snapshots = await Promise.all(
    COLLECTIONS.map((path) => getDocs(collection(firestore, path)))
  )

  const terms = new Map<string, TaxonomyTermRef>()
  for (const snapshot of snapshots) {
    for (const document of snapshot.docs) {
      const data = document.data()
      const term: TaxonomyTermRef = {
        id: document.id,
        name: (data.name as string | undefined) ?? '',
        slug: (data.slug as string | undefined) ?? document.id,
      }

      terms.set(term.id, term)
      if (term.slug) terms.set(term.slug, term)
    }
  }

  return terms
}
