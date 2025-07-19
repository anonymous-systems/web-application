import { firebaseServerConfig } from '@workspace/firebase-config/server'

export const authConfig = {
  apiKey: firebaseServerConfig.apiKey!,
  cookieName: 'AuthToken',
  cookieSignatureKeys: [
    process.env.COOKIE_SECRET_CURRENT!,
    process.env.COOKIE_SECRET_PREVIOUS!
  ],
  cookieSerializeOptions: {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 12 * 60 * 60 * 24, // Twelve days
  },
  enableMultipleCookies: true,
  enableCustomToken: true,
  serviceAccount: firebaseServerConfig.serviceAccount,
}