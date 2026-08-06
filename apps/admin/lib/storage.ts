import { getStorage, type Storage } from 'firebase-admin/storage'
import { getFirebaseAdminApp } from '@workspace/firebase-config/admin-app'

export const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? ''

export const storageBucket = (): ReturnType<Storage['bucket']> => {
  // Without this every storage call fails as a generic "Something went wrong".
  if (!STORAGE_BUCKET) {
    throw new Error(
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not set — storage is unavailable.'
    )
  }

  return getStorage(getFirebaseAdminApp()).bucket(STORAGE_BUCKET)
}

/**
 * The Storage emulator's host, or null when pointed at real GCS. `emulators:exec`
 * exports both spellings, but a dev server started outside it has only whichever
 * one `.env.local` sets.
 */
export const storageEmulatorHost = (): string | null => {
  const raw =
    process.env.FIREBASE_STORAGE_EMULATOR_HOST ??
    process.env.STORAGE_EMULATOR_HOST

  return raw ? raw.replace(/^https?:\/\//, '').replace(/\/+$/, '') : null
}

export const isStorageEmulator = (): boolean => storageEmulatorHost() !== null

/**
 * A download token is a permanent, unauthenticated public link, so this is only
 * for objects meant to be public (cover images).
 */
export const storageDownloadUrl = (path: string, token: string): string => {
  const emulator = storageEmulatorHost()
  const origin = emulator
    ? `http://${emulator}`
    : 'https://firebasestorage.googleapis.com'

  return `${origin}/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(path)}?alt=media&token=${token}`
}

/**
 * Reduces a client-supplied filename to its basename so it can't escape its
 * folder, minus the characters that would break out of a quoted
 * `Content-Disposition` header. Returns '' for unusable names (empty, or nothing
 * but dots) so callers reject rather than invent one.
 */
export const safeObjectName = (name: string): string => {
  const base = name.split(/[/\\]/).pop() ?? ''
  const cleaned = base.replace(/[\r\n"]/g, '').trim()

  return /^\.*$/.test(cleaned) ? '' : cleaned
}

/**
 * Restricted to alphanumerics so a crafted name can't smuggle path or header
 * characters into a generated storage path.
 */
export const extensionOf = (name: string): string => {
  const match = /\.([A-Za-z0-9]{1,10})$/.exec(name.trim())

  return match ? `.${match[1]!.toLowerCase()}` : ''
}
