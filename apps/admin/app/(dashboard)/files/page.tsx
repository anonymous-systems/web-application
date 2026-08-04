import { JSX } from 'react'
import { listItems } from '@/services/file-manager-service'
import { FileManager } from '@/components/files/file-manager'
import { StorageItem } from '@/interfaces/storage-item'

export default async function Page(): Promise<JSX.Element> {
  let items: StorageItem[] = []
  try {
    items = await listItems('')
  } catch (error) {
    console.error('Failed to list root files', error)
  }

  return <FileManager initialPath="" initialItems={items} />
}
