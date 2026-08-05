/**
 * A file or folder in Firebase Storage, as shown in the admin Files section.
 * Serializable (ISO dates, plain fields) so it crosses the server/client
 * boundary. Folders are virtual — inferred from object path prefixes.
 */
export interface StorageFile {
  type: 'file'
  name: string
  fullPath: string
  size: number
  contentType: string | null
  updated: string | null
  createdAt: string | null
}

export interface StorageFolder {
  type: 'folder'
  name: string
  fullPath: string
}

export type StorageItem = StorageFile | StorageFolder
