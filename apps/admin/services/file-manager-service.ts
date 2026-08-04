import { randomUUID } from 'node:crypto'
import { storageBucket, storageDownloadUrl } from '@/lib/storage'
import { ActionResult } from '@/interfaces/action-result'
import { StorageFile, StorageItem } from '@/interfaces/storage-item'

const UNEXPECTED = 'Something went wrong. Please try again.'
// Zero-byte marker so empty folders persist and stay navigable.
const PLACEHOLDER = '.keep'

interface FileHandle {
  name: string
  metadata: {
    size?: string | number
    contentType?: string
    updated?: string
    timeCreated?: string
  }
}

const basename = (path: string): string =>
  path.replace(/\/+$/, '').split('/').pop() ?? ''

const toIso = (value?: string): string | null =>
  value ? new Date(value).toISOString() : null

const prefixOf = (path: string): string =>
  path ? `${path.replace(/\/+$/, '')}/` : ''

// getFiles exposes folder prefixes only through the callback's apiResponse, so
// wrap it in a promise. Metadata is inline on each file — one API call lists a
// whole directory.
const listRaw = (
  prefix: string
): Promise<{ files: FileHandle[]; prefixes: string[] }> =>
  new Promise((resolve, reject) => {
    storageBucket().getFiles(
      { prefix, delimiter: '/', autoPaginate: false },
      (error, files, _next, apiResponse) => {
        if (error) return reject(error)
        const prefixes =
          (apiResponse as { prefixes?: string[] } | undefined)?.prefixes ?? []
        resolve({ files: (files ?? []) as unknown as FileHandle[], prefixes })
      }
    )
  })

export const listItems = async (path: string): Promise<StorageItem[]> => {
  const prefix = prefixOf(path)
  const { files, prefixes } = await listRaw(prefix)

  const folders: StorageItem[] = prefixes.map((folderPrefix) => ({
    type: 'folder',
    name: basename(folderPrefix),
    fullPath: folderPrefix.replace(/\/+$/, ''),
  }))

  const fileItems: StorageFile[] = files
    .filter((file) => file.name !== prefix && basename(file.name) !== PLACEHOLDER)
    .map((file) => ({
      type: 'file',
      name: basename(file.name),
      fullPath: file.name,
      size: Number(file.metadata.size ?? 0),
      contentType: file.metadata.contentType ?? null,
      updated: toIso(file.metadata.updated),
      createdAt: toIso(file.metadata.timeCreated),
    }))

  return [
    ...folders.sort((a, b) => a.name.localeCompare(b.name)),
    ...fileItems.sort((a, b) => a.name.localeCompare(b.name)),
  ]
}

export const uploadFiles = async (
  path: string,
  files: File[]
): Promise<ActionResult> => {
  if (files.length === 0) return { ok: false, error: 'No files selected.' }

  try {
    const bucket = storageBucket()
    await Promise.all(
      files.map(async (file) => {
        const target = `${prefixOf(path)}${file.name}`
        const buffer = Buffer.from(await file.arrayBuffer())
        await bucket.file(target).save(buffer, {
          metadata: {
            contentType: file.type || 'application/octet-stream',
            contentDisposition: `attachment; filename="${file.name}"`,
            metadata: { firebaseStorageDownloadTokens: randomUUID() },
          },
        })
      })
    )
    return { ok: true }
  } catch (error) {
    console.error('Failed to upload files', error)
    return { ok: false, error: UNEXPECTED }
  }
}

export const createFolder = async (
  path: string,
  name: string
): Promise<ActionResult> => {
  const clean = name.trim().replace(/\//g, '')
  if (!clean) return { ok: false, error: 'Folder name is required.' }

  try {
    const target = `${prefixOf(path)}${clean}/${PLACEHOLDER}`
    await storageBucket()
      .file(target)
      .save(Buffer.from(''), { metadata: { contentType: 'application/x-empty' } })
    return { ok: true }
  } catch (error) {
    console.error('Failed to create folder', error)
    return { ok: false, error: UNEXPECTED }
  }
}

export const deleteItems = async (
  items: StorageItem[]
): Promise<ActionResult> => {
  try {
    const bucket = storageBucket()
    await Promise.all(
      items.map((item) =>
        item.type === 'folder'
          ? bucket.deleteFiles({ prefix: `${item.fullPath}/`, force: true })
          : bucket.file(item.fullPath).delete()
      )
    )
    return { ok: true }
  } catch (error) {
    console.error('Failed to delete items', error)
    return { ok: false, error: UNEXPECTED }
  }
}

export const getDownloadUrl = async (
  fullPath: string
): Promise<ActionResult & { url?: string }> => {
  try {
    const file = storageBucket().file(fullPath)
    const [metadata] = await file.getMetadata()

    let token = (
      metadata.metadata?.firebaseStorageDownloadTokens as string | undefined
    )?.split(',')[0]
    if (!token) {
      token = randomUUID()
      await file.setMetadata({
        metadata: { firebaseStorageDownloadTokens: token },
      })
    }

    return { ok: true, url: storageDownloadUrl(fullPath, token) }
  } catch (error) {
    console.error('Failed to get download URL', error)
    return { ok: false, error: UNEXPECTED }
  }
}
