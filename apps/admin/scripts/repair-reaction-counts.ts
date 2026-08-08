import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { applyReactionCountRepair } from '../lib/apply-reaction-count-repair'

/**
 * Recomputes every comment's `likeCount` / `dislikeCount` from its reactions
 * subcollection, which is the source of truth. `DRY_RUN=yes` reports what would
 * change without writing.
 *
 * Unlike the migrations beside it, this is not one-time. The totals are kept by
 * a trigger applying increments, so they drift whenever an event happens with
 * no trigger to see it — a reaction written while the function was undeployed
 * is never counted, and the next change to it still decrements, which is how
 * dev ended up with a `likeCount` of -1 against a single dislike. Re-run this
 * after any period where the functions were not deployed.
 *
 * Idempotent, so running it when nothing has drifted is free.
 *
 *   DRY_RUN=yes CONFIRM_PROD=yes FIREBASE_PROJECT_ID=<project> \
 *     pnpm --filter admin repair:reactions
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
    `${dryRun ? '[dry-run] ' : ''}Repairing reaction counts in "${projectId}" (${target})…`
  )

  const db = getFirestore(initializeApp({ projectId }))
  const { total, repaired } = await applyReactionCountRepair(db, { dryRun })

  for (const line of repaired) console.log(`  ${line}`)
  console.log(
    `${dryRun ? 'Would repair' : 'Repaired'} ${repaired.length} of ${total} comments.`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Repair failed:', error)
    process.exit(1)
  })
