import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { applyStoryMigrations } from '../lib/apply-story-migrations'

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
  const { total, migrated, warnings } = await applyStoryMigrations(db, { dryRun })

  for (const warning of warnings) console.warn(`  ${warning}`)
  console.log(
    `Done. ${dryRun ? 'Would migrate' : 'Migrated'} ${migrated} of ${total} stories.`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
