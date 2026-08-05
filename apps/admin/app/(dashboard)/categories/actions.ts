'use server'

import { revalidatePath } from 'next/cache'
import { ensureAdmin } from '@/lib/admin-caller'
import { createTerm, deleteTerm, updateTerm } from '@/services/taxonomy-service'
import { AppRoutes } from '@/lib/app-routes'
import { ActionResult } from '@/interfaces/action-result'

const COLLECTION = 'categories'

const revalidate = (result: ActionResult): ActionResult => {
  if (result.ok) revalidatePath(AppRoutes.categories)
  return result
}

export const createCategory = async (
  name: string,
  description: string
): Promise<ActionResult> => {
  const guard = await ensureAdmin('categories')
  if (!guard.ok) return guard

  return revalidate(await createTerm(COLLECTION, name, description))
}

export const updateCategory = async (
  id: string,
  name: string,
  description: string
): Promise<ActionResult> => {
  const guard = await ensureAdmin('categories')
  if (!guard.ok) return guard

  return revalidate(await updateTerm(COLLECTION, id, name, description))
}

export const deleteCategory = async (id: string): Promise<ActionResult> => {
  const guard = await ensureAdmin('categories')
  if (!guard.ok) return guard

  return revalidate(await deleteTerm(COLLECTION, id))
}
