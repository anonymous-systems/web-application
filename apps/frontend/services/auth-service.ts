import { GoogleAuthProvider, signInWithPopup, UserCredential, signOut as _signOut } from 'firebase/auth'
import { getFirebaseAuth as auth, getAppCheck } from '@workspace/firebase-config/client'
import { getToken } from 'firebase/app-check'

const signInWithGoogle = async (): Promise<UserCredential | null> => {
  try {
    const provider = new GoogleAuthProvider()

    return signInWithPopup(auth(), provider)
      .catch((error) => { throw error })
  } catch (error) {
    console.error(error)
    return null
  }
}

export const login = async (idToken: string): Promise<boolean> => {
  try {
    const headers: HeadersInit = { Authorization: `Bearer ${idToken}` }

    if (process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY) {
      const appCheckTokenResponse = await getToken(getAppCheck(), false)
        .catch(error => { throw error })
      headers["X-Firebase-AppCheck"] = appCheckTokenResponse.token
    }


    await fetch('/api/login', { method: 'GET', headers })
      .catch(error => { throw error })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const signInWithCredential = async (credential: UserCredential): Promise<boolean> => {
  try {
    const idToken = await credential.user.getIdToken()
      .catch(error => { throw error })

    return login(idToken)
  } catch (error) {
    console.error(error)
    return false
  }
}

export const signIn = async (): Promise<boolean> => {
  try {
    const credential = await signInWithGoogle()
    if (credential == null) return false

    return signInWithCredential(credential)
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