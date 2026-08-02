'use server'

import { revalidatePath } from 'next/cache'
import { ensureAdmin } from '@/lib/admin-caller'
import { deleteComment as deleteCommentDoc } from '@/services/comment-service'
import { AppRoutes } from '@/lib/app-routes'
import { ActionResult } from '@/interfaces/action-result'

export const deleteComment = async (
  storyId: string,
  id: string
): Promise<ActionResult> => {
  const guard = await ensureAdmin('comments')
  if (!guard.ok) return guard

  const result = await deleteCommentDoc(storyId, id)
  if (result.ok) revalidatePath(AppRoutes.comments)
  return result
}
