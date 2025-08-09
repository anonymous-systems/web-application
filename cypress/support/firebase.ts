import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth, Auth } from 'firebase/auth'
import { AppCheck, ReCaptchaEnterpriseProvider, initializeAppCheck } from 'firebase/app-check'

let appCheck: AppCheck | null = null
const getOrInitializeAppCheck = (app: FirebaseApp) => {
  if (appCheck != null) return appCheck

  Object.assign(
    window,
    {
      FIREBASE_APPCHECK_DEBUG_TOKEN: Cypress.env('firebaseAppCheckDebugToken')
    }
  )

  appCheck = initializeAppCheck(
    app,
    {
      provider: new ReCaptchaEnterpriseProvider(Cypress.env('firebaseRecaptchaSiteKey')),
      isTokenAutoRefreshEnabled: true
    }
  )

  return appCheck
}

const getFirebaseApp = (): FirebaseApp => {
  if (getApps().length) return getApp()

  const app = initializeApp(Cypress.env('firebaseConfig'))

  if (Cypress.env('firebaseRecaptchaSiteKey')) {
    console.debug('⮑ CYPRESS: Initializing Firebase App Check with reCAPTCHA v3.')
    getOrInitializeAppCheck(app)
  }

  return app
}

const getFirebaseAuth = () => {
  // @ts-ignore
  const auth = getAuth(getFirebaseApp())

  // https://stackoverflow.com/questions/73605307/firebase-auth-emulator-fails-intermittently-with-auth-emulator-config-failed
  if (Cypress.env('firebaseAuthEmulatorHost')) {
    (auth as unknown as any)._canInitEmulator = true
    connectAuthEmulator(auth, `http://${Cypress.env('firebaseAuthEmulatorHost')}`, {
      disableWarnings: true
    })
  }

  return auth as unknown as Auth
}

const getFirebaseAppCheck = () => {
  const firebaseApp = getFirebaseApp()

  return getOrInitializeAppCheck(firebaseApp)
}

export {
  getFirebaseAuth,
  getFirebaseAppCheck
}