'use server'

import { revalidatePath } from 'next/cache'
import { ensureAdmin } from '@/lib/admin-caller'
import {
  createStory as createStoryDoc,
  deleteStory as deleteStoryDoc,
  updateStory as updateStoryDoc,
} from '@/services/story-service'
import { uploadCover } from '@/services/storage-service'
import { AppRoutes } from '@/lib/app-routes'
import { ActionResult } from '@/interfaces/action-result'
import { StoryInput } from '@workspace/ui/models/schemas/story'

export const createStory = async (
  input: StoryInput
): Promise<ActionResult & { id?: string }> => {
  const guard = await ensureAdmin('stories')
  if (!guard.ok) return guard

  const result = await createStoryDoc(input, guard.caller.uid)
  if (result.ok) revalidatePath(AppRoutes.stories)
  return result
}

export const updateStory = async (
  id: string,
  input: StoryInput
): Promise<ActionResult> => {
  const guard = await ensureAdmin('stories')
  if (!guard.ok) return guard

  const result = await updateStoryDoc(id, input)
  if (result.ok) revalidatePath(AppRoutes.stories)
  return result
}

export const deleteStory = async (id: string): Promise<ActionResult> => {
  const guard = await ensureAdmin('stories')
  if (!guard.ok) return guard

  const result = await deleteStoryDoc(id)
  if (result.ok) revalidatePath(AppRoutes.stories)
  return result
}

export const uploadStoryCover = async (
  formData: FormData
): Promise<ActionResult & { url?: string }> => {
  const guard = await ensureAdmin('stories')
  if (!guard.ok) return guard

  const file = formData.get('file')
  if (!(file instanceof File)) return { ok: false, error: 'No file provided.' }

  return uploadCover(file, 'story-covers')
}
