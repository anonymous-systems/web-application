import { App, cert, getApp, getApps, initializeApp } from 'firebase-admin/app'
import { firebaseServerConfig } from './server'

const initFirebaseApp = (): App => {
  if (!firebaseServerConfig.serviceAccount) return initializeApp()

  // Against the Auth emulator the SDK only needs the project id, not credentials.
  if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    return initializeApp({
      projectId: firebaseServerConfig.serviceAccount.projectId,
    })
  }

  return initializeApp({
    credential: cert(firebaseServerConfig.serviceAccount),
  })
}

/**
 * The single Admin SDK app, shared by the admin and frontend servers. Both
 * initialise it identically, and sharing one copy matters beyond duplication:
 * `firestore.ts` narrows values with `instanceof Timestamp`, which silently
 * fails across two installs of firebase-admin.
 */
export const getFirebaseAdminApp = (): App => {
  if (getApps().length > 0) return getApp()

  return initFirebaseApp()
}
