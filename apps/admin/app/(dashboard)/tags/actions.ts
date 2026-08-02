'use server'

import { revalidatePath } from 'next/cache'
import { ensureAdmin } from '@/lib/admin-caller'
import { createTerm, deleteTerm, updateTerm } from '@/services/taxonomy-service'
import { AppRoutes } from '@/lib/app-routes'
import { ActionResult } from '@/interfaces/action-result'

const COLLECTION = 'tags'

const revalidate = (result: ActionResult): ActionResult => {
  if (result.ok) revalidatePath(AppRoutes.tags)
  return result
}

export const createTag = async (
  name: string,
  description: string
): Promise<ActionResult> => {
  const guard = await ensureAdmin('tags')
  if (!guard.ok) return guard

  return revalidate(await createTerm(COLLECTION, name, description))
}

export const updateTag = async (
  id: string,
  name: string,
  description: string
): Promise<ActionResult> => {
  const guard = await ensureAdmin('tags')
  if (!guard.ok) return guard

  return revalidate(await updateTerm(COLLECTION, id, name, description))
}

export const deleteTag = async (id: string): Promise<ActionResult> => {
  const guard = await ensureAdmin('tags')
  if (!guard.ok) return guard

  return revalidate(await deleteTerm(COLLECTION, id))
}
