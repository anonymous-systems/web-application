'use server'

import { revalidatePath } from 'next/cache'
import { getAdminCaller } from '@/lib/admin-caller'
import { deleteComment as deleteCommentDoc } from '@/services/comment-service'
import { AppRoutes } from '@/lib/app-routes'
import { ActionResult } from '@/interfaces/action-result'

const NOT_ADMIN = 'You must be an admin to manage comments.'

export const deleteComment = async (
  storyId: string,
  id: string
): Promise<ActionResult> => {
  const caller = await getAdminCaller()
  if (!caller?.isAdmin) return { ok: false, error: NOT_ADMIN }

  const result = await deleteCommentDoc(storyId, id)
  if (result.ok) revalidatePath(AppRoutes.comments)
  return result
}
