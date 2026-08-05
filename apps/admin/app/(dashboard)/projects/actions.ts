'use server'

import { revalidatePath } from 'next/cache'
import { ensureAdmin } from '@/lib/admin-caller'
import {
  createProject as createProjectDoc,
  deleteProject as deleteProjectDoc,
  updateProject as updateProjectDoc,
} from '@/services/project-service'
import { uploadCover } from '@/services/storage-service'
import { AppRoutes } from '@/lib/app-routes'
import { ActionResult } from '@/interfaces/action-result'
import { ProjectInput } from '@workspace/ui/models/schemas/project'

export const createProject = async (
  input: ProjectInput
): Promise<ActionResult & { id?: string }> => {
  const guard = await ensureAdmin('projects')
  if (!guard.ok) return guard

  const result = await createProjectDoc(input, guard.caller.uid)
  if (result.ok) revalidatePath(AppRoutes.projects)
  return result
}

export const updateProject = async (
  id: string,
  input: ProjectInput
): Promise<ActionResult> => {
  const guard = await ensureAdmin('projects')
  if (!guard.ok) return guard

  const result = await updateProjectDoc(id, input)
  if (result.ok) revalidatePath(AppRoutes.projects)
  return result
}

export const deleteProject = async (id: string): Promise<ActionResult> => {
  const guard = await ensureAdmin('projects')
  if (!guard.ok) return guard

  const result = await deleteProjectDoc(id)
  if (result.ok) revalidatePath(AppRoutes.projects)
  return result
}

export const uploadProjectCover = async (
  formData: FormData
): Promise<ActionResult & { url?: string }> => {
  const guard = await ensureAdmin('projects')
  if (!guard.ok) return guard

  const file = formData.get('file')
  if (!(file instanceof File)) return { ok: false, error: 'No file provided.' }

  return uploadCover(file, 'project-covers')
}
