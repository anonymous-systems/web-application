import admin from 'firebase-admin';

export const firebaseServerConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  serviceAccount: process.env.FIREBASE_ADMIN_PRIVATE_KEY
    ? {
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(
          /\\n/g,
          '\n'
        )!
      }
    : undefined,
  useSecureCookies: process.env.USE_SECURE_COOKIES === 'true'
}

// const getFirebaseApp = () => {
//   if (!firebaseServerConfig.serviceAccount) return admin.initializeApp()
//
//   if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
//     return admin.initializeApp({
//       projectId: firebaseServerConfig.serviceAccount.projectId
//     })
//   }
//
//   return admin.initializeApp({
//     credential: admin.credential.cert(firebaseServerConfig.serviceAccount)
//   })
// }
//
// const getFirebaseAdminApp = () => {
//   if (admin.apps.length > 0) {
//     return admin.apps[0] as admin.app.App
//   }
//
//   admin.firestore.setLogFunction(console.log)
//
//   return getFirebaseApp()
// }
//
// export { getFirebaseAdminApp }