import admin from 'firebase-admin'
import { firebaseServerConfig } from '@workspace/firebase-config/server'
import { App } from 'firebase-admin/app'

const getFirebaseApp = (): App => {
  if (!firebaseServerConfig.serviceAccount) return admin.initializeApp()

  if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    return admin.initializeApp({
      projectId: firebaseServerConfig.serviceAccount.projectId
    })
  }

  return admin.initializeApp({
    credential: admin.credential.cert(firebaseServerConfig.serviceAccount)
  })
}

const getFirebaseAdminApp = (): App => {
  if (admin.apps.length > 0) return admin.apps[0] as admin.app.App

  // admin.firestore.setLogFunction(console.log)

  return getFirebaseApp()
}

export { getFirebaseAdminApp }