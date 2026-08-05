import { FieldValue, type Firestore } from 'firebase-admin/firestore'
import { planProjectMigration } from './project-migration'

export interface MigrationResult {
  total: number
  migrated: number
  warnings: string[]
}

/**
 * Applies the anonsys.tech → current migration (see project-migration.ts) to
 * every `projects` document. Shared by the CLI script and its integration test.
 * Adds timestamps and, when `ownerUid` is given, the `user` reference + roles the
 * old flat projects lacked. Idempotent — already-migrated documents are skipped.
 */
export const applyProjectMigrations = async (
  db: Firestore,
  options: { dryRun?: boolean; ownerUid?: string } = {}
): Promise<MigrationResult> => {
  const snapshot = await db.collection('projects').get()
  const warnings: string[] = []
  let migrated = 0

  for (const doc of snapshot.docs) {
    const data = doc.data()
    const plan = planProjectMigration(data)
    if (!plan.changed) continue
    migrated += 1
    plan.warnings.forEach((warning) => warnings.push(`${doc.id}: ${warning}`))

    if (options.dryRun) continue

    const now = FieldValue.serverTimestamp()
    const update: Record<string, unknown> = {
      ...plan.set,
      createdAt: data.createdAt ?? now,
      updatedAt: now,
      publishedAt: data.publishedAt ?? now,
    }
    if (options.ownerUid) {
      update.user = db.doc(`users/${options.ownerUid}`)
      update.roles = { [options.ownerUid]: 'owner' }
    }
    for (const field of plan.remove) update[field] = FieldValue.delete()

    await doc.ref.update(update)
  }

  return { total: snapshot.size, migrated, warnings }
}
