import { App, cert, getApp, getApps, initializeApp } from 'firebase-admin/app'
import { firebaseServerConfig } from '@workspace/firebase-config/server'

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

export const getFirebaseAdminApp = (): App => {
  if (getApps().length > 0) return getApp()

  return initFirebaseApp()
}
