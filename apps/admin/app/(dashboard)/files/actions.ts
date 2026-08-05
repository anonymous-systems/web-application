'use server'

import { revalidatePath } from 'next/cache'
import { ensureAdmin } from '@/lib/admin-caller'
import {
  createFolder as createFolderInStorage,
  deleteItems as deleteItemsInStorage,
  getDownloadUrl as getDownloadUrlFromStorage,
  listItems as listStorageItems,
  moveItems as moveItemsInStorage,
  renameItem as renameItemInStorage,
  uploadFiles as uploadFilesToStorage,
} from '@/services/file-manager-service'
import { AppRoutes } from '@/lib/app-routes'
import { UNEXPECTED } from '@/lib/errors'
import { ActionResult } from '@/interfaces/action-result'
import { StorageItem } from '@/interfaces/storage-item'

export const listFiles = async (
  path: string
): Promise<ActionResult & { items?: StorageItem[] }> => {
  const guard = await ensureAdmin('files')
  if (!guard.ok) return guard

  try {
    return { ok: true, items: await listStorageItems(path) }
  } catch (error) {
    console.error('Failed to list files', error)
    return { ok: false, error: UNEXPECTED }
  }
}

export const uploadFiles = async (
  path: string,
  formData: FormData
): Promise<ActionResult> => {
  const guard = await ensureAdmin('files')
  if (!guard.ok) return guard

  const files = formData
    .getAll('files')
    .filter((entry): entry is File => entry instanceof File)

  const result = await uploadFilesToStorage(path, files)
  if (result.ok) revalidatePath(AppRoutes.files)
  return result
}

export const createFolder = async (
  path: string,
  name: string
): Promise<ActionResult> => {
  const guard = await ensureAdmin('files')
  if (!guard.ok) return guard

  const result = await createFolderInStorage(path, name)
  if (result.ok) revalidatePath(AppRoutes.files)
  return result
}

export const deleteFiles = async (
  items: StorageItem[]
): Promise<ActionResult> => {
  const guard = await ensureAdmin('files')
  if (!guard.ok) return guard

  const result = await deleteItemsInStorage(items)
  if (result.ok) revalidatePath(AppRoutes.files)
  return result
}

export const getDownloadUrl = async (
  fullPath: string
): Promise<ActionResult & { url?: string }> => {
  const guard = await ensureAdmin('files')
  if (!guard.ok) return guard

  return getDownloadUrlFromStorage(fullPath)
}

export const renameFile = async (
  item: StorageItem,
  newName: string
): Promise<ActionResult> => {
  const guard = await ensureAdmin('files')
  if (!guard.ok) return guard

  const result = await renameItemInStorage(item, newName)
  if (result.ok) revalidatePath(AppRoutes.files)
  return result
}

export const moveFiles = async (
  items: StorageItem[],
  destFolder: string
): Promise<ActionResult> => {
  const guard = await ensureAdmin('files')
  if (!guard.ok) return guard

  const result = await moveItemsInStorage(items, destFolder)
  if (result.ok) revalidatePath(AppRoutes.files)
  return result
}
