import { type Firestore } from 'firebase-admin/firestore'
import { planCountRepair } from './reaction-count-repair'

export interface RepairResult {
  total: number
  repaired: string[]
}

/**
 * Recomputes every comment's reaction totals from its own reactions.
 *
 * Uses a collection-group query so it reaches comments under both stories and
 * projects without knowing the parents — the same reason the counter triggers
 * are declared twice by path.
 *
 * Idempotent: a comment whose totals already match is left untouched, so a
 * second run reports nothing to do.
 */
export const applyReactionCountRepair = async (
  db: Firestore,
  options: { dryRun?: boolean } = {}
): Promise<RepairResult> => {
  const comments = await db.collectionGroup('comments').get()
  const repaired: string[] = []

  for (const comment of comments.docs) {
    const reactions = await comment.ref.collection('reactions').get()
    const plan = planCountRepair(
      comment.data() ?? {},
      reactions.docs.map((doc) => doc.data() ?? {})
    )

    if (!plan.changed) continue

    repaired.push(
      `${comment.ref.path}: ` +
        `likes ${plan.stored.likeCount}→${plan.actual.likeCount}, ` +
        `dislikes ${plan.stored.dislikeCount}→${plan.actual.dislikeCount}`
    )

    if (options.dryRun) continue

    await comment.ref.update({
      likeCount: plan.actual.likeCount,
      dislikeCount: plan.actual.dislikeCount,
    })
  }

  return { total: comments.size, repaired }
}
