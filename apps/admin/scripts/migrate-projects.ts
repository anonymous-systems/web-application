import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { applyProjectMigrations } from '../lib/apply-project-migrations'

/**
 * One-time migration of `projects` documents from the previous anonsys.tech
 * portfolio shape (`name`, `description`, `images[]`, `tags[]`, `link`, `github`,
 * `order`) to the current model (see lib/project-migration.ts). Idempotent —
 * re-running skips already-migrated documents. `DRY_RUN=yes` reports changes
 * without writing. Set `OWNER_UID` to the admin's uid to assign ownership (the old
 * flat projects had no owner); without it, migrated projects have no `user`.
 *
 * Validate against a copy of production before running for real:
 *   1. Export prod projects: gcloud firestore export gs://<bucket>/projects-dump \
 *                              --collection-ids=projects --project <prod-project>
 *   2. Download the dump:     gsutil -m cp -r gs://<bucket>/projects-dump ./projects-dump
 *   3. Dry-run on the copy:   firebase emulators:exec --only firestore \
 *                              --import=./projects-dump \
 *                              "DRY_RUN=yes pnpm --filter admin migrate:projects"
 *   4. Run + inspect:         firebase emulators:exec --only firestore \
 *                              --import=./projects-dump --export-on-exit=./projects-migrated \
 *                              "OWNER_UID=<uid> pnpm --filter admin migrate:projects"
 *   5. Production (once happy): CONFIRM_PROD=yes OWNER_UID=<uid> FIREBASE_PROJECT_ID=<prod-project> \
 *                              GOOGLE_APPLICATION_CREDENTIALS=<sa.json> \
 *                              pnpm --filter admin exec tsx scripts/migrate-projects.ts
 */
const projectId =
  process.env.FIREBASE_PROJECT_ID ??
  process.env.GCLOUD_PROJECT ??
  'anonymous-systems-dev'

const main = async (): Promise<void> => {
  const onEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST)
  const dryRun = process.env.DRY_RUN === 'yes'
  const ownerUid = process.env.OWNER_UID

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
    `${dryRun ? '[dry-run] ' : ''}Migrating projects in "${projectId}" (${target})…`
  )
  if (!ownerUid) {
    console.warn('OWNER_UID not set — migrated projects will have no owner.')
  }

  const db = getFirestore(initializeApp({ projectId }))
  const { total, migrated, warnings } = await applyProjectMigrations(db, {
    dryRun,
    ownerUid,
  })

  for (const warning of warnings) console.warn(`  ${warning}`)
  console.log(
    `Done. ${dryRun ? 'Would migrate' : 'Migrated'} ${migrated} of ${total} projects.`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
