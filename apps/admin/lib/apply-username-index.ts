import { type Firestore } from 'firebase-admin/firestore'
import { planIndexEntry } from './username-index'

export interface BackfillResult {
  users: number
  created: string[]
  conflicts: string[]
}

/**
 * Fills in any `usernames/{username}` entries missing for existing accounts.
 *
 * Idempotent — an account already pointed at by the index is left alone, so a
 * second run reports nothing to do. Conflicts are reported rather than
 * resolved: a username already held by another uid is a question for a person.
 */
export const applyUsernameIndex = async (
  db: Firestore,
  options: { dryRun?: boolean } = {}
): Promise<BackfillResult> => {
  const [users, index] = await Promise.all([
    db.collection('users').get(),
    db.collection('usernames').get(),
  ])

  const existing = new Map(
    index.docs.map((entry) => [entry.id, entry.data()?.userId as string])
  )

  const created: string[] = []
  const conflicts: string[] = []

  for (const user of users.docs) {
    const plan = planIndexEntry(
      { uid: user.id, username: user.data()?.username },
      existing
    )
    if (!plan) continue

    if (plan.action === 'conflict') {
      conflicts.push(
        `${plan.username}: held by ${plan.heldBy}, also claimed by ${plan.userId}`
      )
      continue
    }

    if (plan.action === 'skip') continue

    created.push(`${plan.username} -> ${plan.userId}`)
    if (options.dryRun) continue

    await db.collection('usernames').doc(plan.username).set({
      userId: plan.userId,
    })
    // Keep the in-memory view in step so two users claiming the same name in
    // one run are caught as a conflict rather than silently overwriting.
    existing.set(plan.username, plan.userId)
  }

  return { users: users.size, created, conflicts }
}
