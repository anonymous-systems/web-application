import { randomUUID } from 'node:crypto'
import { storageBucket, storageDownloadUrl } from '@/lib/storage'
import { ActionResult } from '@/interfaces/action-result'

const MAX_BYTES = 5 * 1024 * 1024
const UNEXPECTED = 'Something went wrong. Please try again.'

/**
 * Uploads a story cover to Firebase Storage (Admin SDK) and returns its download
 * URL. Stored under a random path so it never collides and doesn't need the
 * story id — covers can be set before the story is created.
 */
export const uploadStoryCover = async (
  file: File
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
    const path = `story-covers/${randomUUID()}${extension}`
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
    console.error('Failed to upload story cover', error)
    return { ok: false, error: UNEXPECTED }
  }
}
