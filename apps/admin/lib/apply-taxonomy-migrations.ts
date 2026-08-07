import { FieldValue, type Firestore } from 'firebase-admin/firestore'
import { planTaxonomyMigration } from './taxonomy-migration'

export interface MigrationResult {
  total: number
  migrated: number
  warnings: string[]
}

/** The taxonomy collections, all sharing one shape. */
export const TAXONOMY_COLLECTIONS = [
  'categories',
  'tags',
  'technologies',
] as const
export type TaxonomyCollection = (typeof TAXONOMY_COLLECTIONS)[number]

/**
 * Applies the legacy → current migration (see taxonomy-migration.ts) to every
 * document in one taxonomy collection. Shared by the CLI script and its tests.
 * Idempotent — terms that already have a `name` are skipped.
 *
 * Timestamps are only stamped when the legacy document had none: a term that
 * predates them gets `createdAt` now, which is wrong but bounded, and better
 * than a term the admin cannot sort or display.
 */
export const applyTaxonomyMigrations = async (
  db: Firestore,
  collection: TaxonomyCollection,
  options: { dryRun?: boolean } = {}
): Promise<MigrationResult> => {
  const snapshot = await db.collection(collection).get()
  const warnings: string[] = []
  let migrated = 0

  for (const doc of snapshot.docs) {
    const plan = planTaxonomyMigration(doc.id, doc.data())
    plan.warnings.forEach((warning) => warnings.push(`${collection}/${warning}`))
    if (!plan.changed) continue
    migrated += 1

    if (options.dryRun) continue

    const now = FieldValue.serverTimestamp()
    const update: Record<string, unknown> = {
      ...plan.set,
      createdAt: plan.set.createdAt ?? now,
      updatedAt: now,
    }
    for (const field of plan.remove) update[field] = FieldValue.delete()

    await doc.ref.update(update)
  }

  return { total: snapshot.size, migrated, warnings }
}
