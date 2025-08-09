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