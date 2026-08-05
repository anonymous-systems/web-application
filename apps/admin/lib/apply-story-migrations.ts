import { FieldValue, type Firestore } from 'firebase-admin/firestore'
import { planStoryMigration } from './story-migration'

export interface MigrationResult {
  total: number
  migrated: number
  warnings: string[]
}

/**
 * Applies the legacy → current migration (see story-migration.ts) to every
 * `stories` document. Shared by the CLI script and its integration test.
 * Idempotent — already-migrated documents are skipped.
 */
export const applyStoryMigrations = async (
  db: Firestore,
  options: { dryRun?: boolean } = {}
): Promise<MigrationResult> => {
  const snapshot = await db.collection('stories').get()
  const warnings: string[] = []
  let migrated = 0

  for (const doc of snapshot.docs) {
    const plan = planStoryMigration(doc.data())
    if (!plan.changed) continue
    migrated += 1

    if (plan.droppedCategories.length > 0) {
      warnings.push(
        `${doc.id}: kept the first category, dropped ${plan.droppedCategories.join(', ')}`
      )
    }

    if (options.dryRun) continue

    const update: Record<string, unknown> = { ...plan.set }
    for (const field of plan.remove) update[field] = FieldValue.delete()
    await doc.ref.update(update)
  }

  return { total: snapshot.size, migrated, warnings }
}
