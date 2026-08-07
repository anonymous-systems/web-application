import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { applyTaxonomyLinks } from '../lib/apply-taxonomy-links'

/**
 * One-time migration of every story's and project's taxonomy links from stored
 * slugs to Firestore references (see lib/taxonomy-link-migration.ts). Idempotent
 * — fields already holding references are skipped. `DRY_RUN=yes` reports the
 * changes, including the terms it would create, without writing.
 *
 * Renaming a term used to strand the content linking to it, because the link was
 * a copy of the term's slug and the slug was re-derived from the new name. A
 * reference points at the term document itself, so the name and the link stop
 * being the same thing.
 *
 * Content also names terms that were never created — the dev projects hold tags
 * like "UI Clone" that exist only as strings. Those become real terms here, so
 * run this and then review the new entries in admin.
 *
 * Validate against a copy of production before running for real:
 *   1. Export prod:        gcloud firestore export gs://<bucket>/links-dump \
 *                            --collection-ids=stories,projects,categories,tags,technologies \
 *                            --project <prod-project>
 *   2. Download the dump:  gsutil -m cp -r gs://<bucket>/links-dump ./links-dump
 *   3. Dry-run on the copy: firebase emulators:exec --only firestore \
 *                            --import=./links-dump \
 *                            "DRY_RUN=yes pnpm --filter admin migrate:taxonomy-links"
 *   4. Run + inspect:      firebase emulators:exec --only firestore \
 *                            --import=./links-dump --export-on-exit=./links-migrated \
 *                            "pnpm --filter admin migrate:taxonomy-links"
 *   5. Production (once happy): CONFIRM_PROD=yes FIREBASE_PROJECT_ID=<prod-project> \
 *                            GOOGLE_APPLICATION_CREDENTIALS=<sa.json> \
 *                            pnpm --filter admin exec tsx scripts/migrate-taxonomy-links.ts
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

  // Named by what it is, not "PRODUCTION": the guard above fires for any live
  // database, and a dev run announcing itself as production is how a real one
  // stops being read.
  const target = onEmulator
    ? `emulator ${process.env.FIRESTORE_EMULATOR_HOST}`
    : 'LIVE database'
  console.log(
    `${dryRun ? '[dry-run] ' : ''}Linking taxonomy by reference in "${projectId}" (${target})…`
  )

  const db = getFirestore(initializeApp({ projectId }))
  const { total, migrated, created, warnings } = await applyTaxonomyLinks(db, {
    dryRun,
  })

  for (const term of created) {
    console.log(
      `  ${dryRun ? 'would create' : 'created'} ${term.collection}/${term.slug} — "${term.name}"`
    )
  }
  for (const warning of warnings) console.warn(`  ${warning}`)

  console.log(
    `${dryRun ? 'Would migrate' : 'Migrated'} ${migrated} of ${total} documents; ` +
      `${dryRun ? 'would create' : 'created'} ${created.length} terms.`
  )

  if (created.length > 0) {
    console.log('\nReview the new terms in admin — names come from the content.')
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
