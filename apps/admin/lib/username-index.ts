export interface IndexedUser {
  uid: string
  username?: unknown
}

export interface IndexEntry {
  username: string
  userId: string
}

export type IndexPlan =
  | { action: 'create'; username: string; userId: string }
  | { action: 'skip'; username: string; reason: 'already indexed' }
  | { action: 'conflict'; username: string; userId: string; heldBy: string }

/**
 * What the `usernames/{username} -> { userId }` index is missing for one user.
 *
 * The index is the only way a public profile URL resolves to an account: the
 * page reads one document from it rather than querying `users`, because the
 * rules grant `get` there and not `list`. An account with no entry therefore
 * has no reachable profile at all, which is how a real user 404'd — theirs
 * predates the onboarding function that maintains the index.
 *
 * Returns null for users who never finished onboarding. They have no username,
 * so there is nothing to index and no profile to reach.
 *
 * Pure, so the conflict rules are testable without Firestore.
 */
export const planIndexEntry = (
  user: IndexedUser,
  existing: Map<string, string>
): IndexPlan | null => {
  const { username } = user
  if (typeof username !== 'string' || username.trim() === '') return null

  const heldBy = existing.get(username)
  if (heldBy === undefined) {
    return { action: 'create', username, userId: user.uid }
  }

  if (heldBy === user.uid) {
    return { action: 'skip', username, reason: 'already indexed' }
  }

  // Never reassign. A username already pointing at someone else means two
  // accounts claim it, and picking a winner here would silently move a public
  // profile URL from one person to another.
  return { action: 'conflict', username, userId: user.uid, heldBy }
}
