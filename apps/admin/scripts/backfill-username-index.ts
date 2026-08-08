import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { applyUsernameIndex } from '../lib/apply-username-index'

/**
 * Backfills the `usernames/{username} -> { userId }` index from existing
 * accounts. `DRY_RUN=yes` reports what would change without writing.
 *
 * The index is what makes a public profile URL resolve — `/u/{username}` reads
 * one document from it, because the rules allow `get` there and not `list` on
 * users. Only the onboarding function writes it, so any account created before
 * that function existed has no entry and no reachable profile: dev had one real
 * user and an entirely empty index.
 *
 * Idempotent, so running it when nothing is missing is free. Worth re-running
 * after importing users by any route other than onboarding.
 *
 *   DRY_RUN=yes CONFIRM_PROD=yes FIREBASE_PROJECT_ID=<project> \
 *     pnpm --filter admin backfill:usernames
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
    `${dryRun ? '[dry-run] ' : ''}Backfilling the username index in "${projectId}" (${target})…`
  )

  const db = getFirestore(initializeApp({ projectId }))
  const { users, created, conflicts } = await applyUsernameIndex(db, { dryRun })

  for (const entry of created) console.log(`  ${dryRun ? 'would add' : 'added'} ${entry}`)
  for (const conflict of conflicts) console.warn(`  CONFLICT ${conflict}`)

  console.log(
    `${dryRun ? 'Would index' : 'Indexed'} ${created.length} of ${users} accounts` +
      (conflicts.length ? `; ${conflicts.length} need a decision.` : '.')
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Backfill failed:', error)
    process.exit(1)
  })
