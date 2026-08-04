import { randomUUID } from 'node:crypto'
import { storageBucket, storageDownloadUrl } from '@/lib/storage'
import { ActionResult } from '@/interfaces/action-result'

const MAX_BYTES = 5 * 1024 * 1024
const UNEXPECTED = 'Something went wrong. Please try again.'

/**
 * Uploads a cover image to Firebase Storage (Admin SDK) and returns its download
 * URL. `folder` is the storage prefix (e.g. `story-covers`, `project-covers`).
 * Stored under a random path so it never collides and doesn't need the owning
 * document's id — covers can be set before the document is created.
 */
export const uploadCover = async (
  file: File,
  folder: string
): Promise<ActionResult & { url?: string }> => {
  if (file.size === 0) return { ok: false, error: 'No file selected.' }
  if (!file.type.startsWith('image/')) {
    return { ok: false, error: 'Cover must be an image.' }
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: 'Cover must be 5 MB or smaller.' }
  }

  try {
    const token = randomUUID()
    const dot = file.name.lastIndexOf('.')
    const extension = dot >= 0 ? file.name.slice(dot) : ''
    const path = `${folder}/${randomUUID()}${extension}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await storageBucket()
      .file(path)
      .save(buffer, {
        metadata: {
          contentType: file.type,
          metadata: { firebaseStorageDownloadTokens: token },
        },
      })

    return { ok: true, url: storageDownloadUrl(path, token) }
  } catch (error) {
    console.error('Failed to upload cover', error)
    return { ok: false, error: UNEXPECTED }
  }
}
