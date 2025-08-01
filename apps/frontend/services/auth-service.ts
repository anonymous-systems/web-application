import { GoogleAuthProvider, signInWithPopup, UserCredential, signOut as _signOut } from 'firebase/auth'
import { getFirebaseAuth as auth } from '@workspace/firebase-config/client'

export const signInWithGoogle = async (): Promise<UserCredential | null> => {
  try {
    const provider = new GoogleAuthProvider()

    return signInWithPopup(auth(), provider)
      .catch((error) => { throw error })
  } catch (error) {
    console.error(error)
    return null
  }
}

export const signIn = async (): Promise<boolean> => {
  try {
    const credential = await signInWithGoogle()
    if (credential == null) {
      return false
    }
    const idToken = await credential.user.getIdToken()
      .catch(error => { throw error })

    await fetch('/api/login', { headers: { Authorization: `Bearer ${idToken}` } })
      .catch(error => { throw error })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const signOut = async (): Promise<boolean> => {
  try {
    await _signOut(auth()).catch(error => { throw error })

    await fetch('/api/logout', { method: 'GET', headers: {} })
      .catch(error => { throw error })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}