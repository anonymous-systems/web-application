import { getApp, getApps, initializeApp, FirebaseApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { AppCheck, initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'

export const firebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

const getFirebaseApp = () => {
  if (getApps().length) return getApp()

  const app = initializeApp(firebaseClientConfig)

  if (process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY) {
    console.debug('⮑ FRONTEND: Initializing Firebase App Check with reCAPTCHA v3.')
    getOrInitializeAppCheck(app)
  }

  return app
}

const getFirebaseAuth = () => {
  const auth = getAuth(getFirebaseApp())

  // Note: In-memory persistence is not recommended refresh token api implemented for this
  // setPersistence(auth, inMemoryPersistence)

  if (process.env.NEXT_PUBLIC_AUTH_EMULATOR_HOST) {
    // https://stackoverflow.com/questions/73605307/firebase-auth-emulator-fails-intermittently-with-auth-emulator-config-failed
    (auth as unknown as any)._canInitEmulator = true
    connectAuthEmulator(auth, `http://${process.env.NEXT_PUBLIC_AUTH_EMULATOR_HOST}`, {
      disableWarnings: true
    })
  }

  return auth
}

const getFirebaseFunctions = () => {
  const functions = getFunctions(getFirebaseApp())

  if (process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_HOST) {
    const split = process.env.NEXT_PUBLIC_FUNCTIONS_EMULATOR_HOST.split(':')
    const host = split[0] as string
    const port = parseInt(split[1] as string, 10)
    connectFunctionsEmulator(functions, host, port)
  }

  return functions
}

const getFirebaseStorage = () => {
  const storage = getStorage(getFirebaseApp())

  if (process.env.NEXT_PUBLIC_STORAGE_EMULATOR_HOST) {
    const split = process.env.NEXT_PUBLIC_STORAGE_EMULATOR_HOST.split(':')
    const host = split[0] as string
    const port = parseInt(split[1] as string, 10)
    connectStorageEmulator(storage, host, port)
  }

  return storage
}

let appCheck: AppCheck | null = null

const getOrInitializeAppCheck = (app: FirebaseApp): AppCheck => {
  if (appCheck != null) return appCheck

  if (process.env.NODE_ENV !== 'production') {
    Object.assign(
      window,
      {
        FIREBASE_APPCHECK_DEBUG_TOKEN: process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_DEBUG_TOKEN
      }
    )
  }

  appCheck = initializeAppCheck(
    app,
    {
      provider: new ReCaptchaEnterpriseProvider(
        process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY!
      ),
      isTokenAutoRefreshEnabled: true
    }
  )

  return appCheck
}

const getAppCheck = () => {
  const app = getFirebaseApp()

  return getOrInitializeAppCheck(app)
}


export {
  getFirebaseAuth,
  getFirebaseFunctions,
  getFirebaseStorage,
  getAppCheck
}