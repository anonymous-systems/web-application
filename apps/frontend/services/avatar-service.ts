import { getFirebaseStorage } from '@workspace/firebase-config/client'
import { ref, listAll, getDownloadURL } from 'firebase/storage'

export const getAvatars = async (): Promise<string[] | null> => {
  try {
    const storage = getFirebaseStorage()

    const avatarsRef = ref(storage, 'avatars')

    const avatarRefs = await listAll(avatarsRef)
      .then(res => res.items)

    const avatarUrls = await Promise.all(
      avatarRefs.map(avatarRef => getDownloadURL(avatarRef))
    ).catch(error => { throw error })

    return avatarUrls
  } catch (error) {
    console.error(error)
    return null
  }
}