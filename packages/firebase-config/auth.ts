import { firebaseServerConfig } from './server'

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
    secure: firebaseServerConfig.useSecureCookies,
    sameSite: "lax" as const,
    maxAge: 12 * 60 * 60 * 24, // Twelve days
  },
  enableMultipleCookies: true,
  enableCustomToken: false,
  experimental_enableTokenRefreshOnExpiredKidHeader: true,
  debug: process.env.NODE_ENV === 'development',
  serviceAccount: firebaseServerConfig.serviceAccount
}