import { getStorage, type Storage } from 'firebase-admin/storage'
import { getFirebaseAdminApp } from '@/lib/firebase-admin'

export const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? ''

export const storageBucket = (): ReturnType<Storage['bucket']> =>
  getStorage(getFirebaseAdminApp()).bucket(STORAGE_BUCKET)

/**
 * Firebase download URL for a stored object + token, pointed at the emulator
 * when one is configured. Shared by cover uploads and the file manager.
 */
export const storageDownloadUrl = (path: string, token: string): string => {
  const host = process.env.FIREBASE_STORAGE_EMULATOR_HOST
    ? `http://${process.env.FIREBASE_STORAGE_EMULATOR_HOST}`
    : 'https://firebasestorage.googleapis.com'
  return `${host}/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(path)}?alt=media&token=${token}`
}
