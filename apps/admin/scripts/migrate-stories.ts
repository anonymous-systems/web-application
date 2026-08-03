import { initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { planStoryMigration } from '../lib/story-migration'

/**
 * One-time migration of `stories` documents from the previous app's shape to the
 * current model (see lib/story-migration.ts). Idempotent — re-running skips
 * already-migrated documents. `DRY_RUN=yes` reports changes without writing.
 *
 * Validate against a copy of production before running for real:
 *   1. Export prod stories:   gcloud firestore export gs://<bucket>/stories-dump \
 *                               --collection-ids=stories --project <prod-project>
 *   2. Download the dump:     gsutil -m cp -r gs://<bucket>/stories-dump ./stories-dump
 *   3. Dry-run on the copy:   firebase emulators:exec --only firestore \
 *                               --import=./stories-dump \
 *                               "DRY_RUN=yes pnpm --filter admin migrate:stories"
 *   4. Run + inspect:         firebase emulators:exec --only firestore \
 *                               --import=./stories-dump --export-on-exit=./stories-migrated \
 *                               "pnpm --filter admin migrate:stories"
 *   5. Production (once happy): CONFIRM_PROD=yes FIREBASE_PROJECT_ID=<prod-project> \
 *                               GOOGLE_APPLICATION_CREDENTIALS=<sa.json> \
 *                               pnpm --filter admin exec tsx scripts/migrate-stories.ts
 */
const projectId =
  process.env.FIREBASE_PROJECT_ID ??
  process.env.GCLOUD_PROJECT ??
  'anonymous-systems-dev'

const main = async (): Promise<void> => {
  const onEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST)
  const dryRun = process.env.DRY_RUN === 'yes'

  if (!onEmulator && process.env.CONFIRM_PROD !== 'yes') {
    console.error(
      'Refusing to run against production. Set CONFIRM_PROD=yes to proceed.'
    )
    process.exit(1)
  }

  const target = onEmulator
    ? `emulator ${process.env.FIRESTORE_EMULATOR_HOST}`
    : 'PRODUCTION'
  console.log(
    `${dryRun ? '[dry-run] ' : ''}Migrating stories in "${projectId}" (${target})…`
  )

  const db = getFirestore(initializeApp({ projectId }))
  const snapshot = await db.collection('stories').get()

  let migrated = 0
  for (const doc of snapshot.docs) {
    const plan = planStoryMigration(doc.data())
    if (!plan.changed) continue
    migrated += 1

    if (dryRun) {
      console.log(
        `  ${doc.id}: set ${Object.keys(plan.set).join(', ') || '—'}; drop ${plan.remove.join(', ')}`
      )
    } else {
      const update: Record<string, unknown> = { ...plan.set }
      for (const field of plan.remove) update[field] = FieldValue.delete()
      await doc.ref.update(update)
    }

    if (plan.droppedCategories.length > 0) {
      console.warn(
        `  ${doc.id}: kept the first category, dropped ${plan.droppedCategories.join(', ')}`
      )
    }
  }

  const verb = dryRun ? 'Would migrate' : 'Migrated'
  console.log(`Done. ${verb} ${migrated} of ${snapshot.size} stories.`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
