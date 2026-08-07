'use server'

import { revalidatePath } from 'next/cache'
import { ensureAdmin } from '@/lib/admin-caller'
import {
  deleteComment as deleteCommentDoc,
  dismissReports as dismissReportsDoc,
} from '@/services/comment-service'
import { AppRoutes } from '@/lib/app-routes'
import { ActionResult } from '@/interfaces/action-result'
import { CommentParentType } from '@/interfaces/comment'

export const deleteComment = async (
  parentType: CommentParentType,
  parentId: string,
  id: string
): Promise<ActionResult> => {
  const guard = await ensureAdmin('comments')
  if (!guard.ok) return guard

  const result = await deleteCommentDoc(parentType, parentId, id)
  if (result.ok) revalidatePath(AppRoutes.comments)
  return result
}

export const dismissReports = async (
  parentType: CommentParentType,
  parentId: string,
  id: string
): Promise<ActionResult> => {
  const guard = await ensureAdmin('comments')
  if (!guard.ok) return guard

  const result = await dismissReportsDoc(parentType, parentId, id)
  if (result.ok) revalidatePath(AppRoutes.comments)
  return result
}
