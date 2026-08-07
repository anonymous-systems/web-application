import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import {
  applyTaxonomyMigrations,
  TAXONOMY_COLLECTIONS,
} from '../lib/apply-taxonomy-migrations'

/**
 * One-time migration of the taxonomy collections (`categories`, `tags`,
 * `technologies`) from the previous app's shape to the current model (see
 * lib/taxonomy-migration.ts). Idempotent — re-running skips terms that already
 * have a `name`. `DRY_RUN=yes` reports changes without writing.
 *
 * These collections were missed when stories and projects were migrated, which
 * is why the Tags page listed 4 of 12 terms in dev and 0 of 78 in prod:
 * `listTerms` ordered by `name`, and Firestore omits documents missing the
 * ordered field.
 *
 * Validate against a copy of production before running for real:
 *   1. Export prod:        gcloud firestore export gs://<bucket>/taxonomy-dump \
 *                            --collection-ids=categories,tags,technologies \
 *                            --project <prod-project>
 *   2. Download the dump:  gsutil -m cp -r gs://<bucket>/taxonomy-dump ./taxonomy-dump
 *   3. Dry-run on the copy: firebase emulators:exec --only firestore \
 *                            --import=./taxonomy-dump \
 *                            "DRY_RUN=yes pnpm --filter admin migrate:taxonomy"
 *   4. Run + inspect:      firebase emulators:exec --only firestore \
 *                            --import=./taxonomy-dump --export-on-exit=./taxonomy-migrated \
 *                            "pnpm --filter admin migrate:taxonomy"
 *   5. Production (once happy): CONFIRM_PROD=yes FIREBASE_PROJECT_ID=<prod-project> \
 *                            GOOGLE_APPLICATION_CREDENTIALS=<sa.json> \
 *                            pnpm --filter admin exec tsx scripts/migrate-taxonomy.ts
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
    `${dryRun ? '[dry-run] ' : ''}Migrating taxonomy in "${projectId}" (${target})…`
  )

  const db = getFirestore(initializeApp({ projectId }))

  for (const collection of TAXONOMY_COLLECTIONS) {
    const { total, migrated, warnings } = await applyTaxonomyMigrations(
      db,
      collection,
      { dryRun }
    )

    for (const warning of warnings) console.warn(`  ${warning}`)
    console.log(
      `${collection}: ${dryRun ? 'would migrate' : 'migrated'} ${migrated} of ${total}.`
    )
  }

  // Names are derived from slugs, so `google-cloud-run` becomes "Google Cloud
  // Run" but `ssr` becomes "Ssr". Nothing can infer the difference.
  console.log('\nReview the derived names in admin and rename any acronyms.')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
