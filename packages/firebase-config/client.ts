import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

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

const app = initializeApp(firebaseClientConfig)

// const appCheck = initializeAppCheck(
//   app,
//   {
//     provider: new ReCaptchaV3Provider(process.env.REACT_APP_RECAPTCHA_SITE_KEY),
//     isTokenAutoRefreshEnabled: true
//   }
// )
// const analytics = getAnalytics(app)
const auth = getAuth(app)
// const db = getFirestore(app)
// const storage = getStorage(app)
// const ai = getAI(app, { backend: new GoogleAIBackend() })
// const functions = getFunctions(app)

// const isLocal = true
// if (isLocal) {
//   console.debug('⮑ Starting application in development mode.')

//   Note: Firebase Auth Emulator will not validate JWTs, so it can not be used for local development
//   See Warning here: Received a signed JWT. Auth Emulator does not validate JWTs and IS NOT SECURE
//   connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })

//   connectFirestoreEmulator(db, 'localhost', 8080)
//   connectStorageEmulator(storage, 'localhost', 9199)
//   connectFunctionsEmulator(functions, 'localhost', 5001)
// }

export {
  auth,
  // analytics, db, storage, ai, appCheck, functions
}