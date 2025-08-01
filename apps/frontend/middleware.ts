import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware, redirectToHome, redirectToLogin } from 'next-firebase-auth-edge'
import { authConfig } from '@workspace/firebase-config/auth'
import { AppRoutes, AuthRoutes, PrivateRoutes, PublicRoutes } from '@/lib/app-routes'

const AUTH_PATHS = Object.values(AuthRoutes)
const PUBLIC_PATHS = Object.values(PublicRoutes)
const PRIVATE_PATHS = Object.values(PrivateRoutes)

export const middleware = async (request: NextRequest) => {
  return authMiddleware(request, {
    loginPath: '/api/login',
    logoutPath: '/api/logout',
    refreshTokenPath: '/api/refresh-token',
    apiKey: authConfig.apiKey,
    cookieName: authConfig.cookieName,
    cookieSignatureKeys: authConfig.cookieSignatureKeys,
    cookieSerializeOptions: authConfig.cookieSerializeOptions,
    enableMultipleCookies: authConfig.enableMultipleCookies,
    enableCustomToken: authConfig.enableCustomToken,
    serviceAccount: authConfig.serviceAccount,
    handleValidToken: async ({ decodedToken }, headers) => {
      // remove onboarding path from auth paths
      const AuthPathsWithoutOnboarding = AUTH_PATHS
        .filter((path) => path !== AppRoutes.onboarding)
      if (AuthPathsWithoutOnboarding.includes(request.nextUrl.pathname)) {
        console.debug('User is authenticated, redirecting to home page')
        return redirectToHome(request)
      }

      const userCompletedOnboarding = decodedToken.onboardingComplete || false
      if (PRIVATE_PATHS.includes(request.nextUrl.pathname) && !userCompletedOnboarding) {
        const userId = decodedToken.uid
        console.debug('User has not completed onboarding, redirecting to onboarding page', { userId })
        return redirectToLogin(request, { path: AppRoutes.onboarding, publicPaths: PUBLIC_PATHS })
      }

      return NextResponse.next({ request: { headers } })
    },
    handleInvalidToken: async (reason) => {
      // console.debug('Missing or malformed credentials', {reason})
      if (PRIVATE_PATHS.includes(request.nextUrl.pathname)) {
        console.debug('User is not authenticated to access this page', { reason })
        return redirectToLogin(request, { path: AppRoutes.signIn, publicPaths: PUBLIC_PATHS })
      }
      return NextResponse.next()
    },
    handleError: async (error) => {
      console.error('Unhandled authentication error', error)

      return redirectToLogin(request, { path: AppRoutes.signIn, publicPaths: PUBLIC_PATHS })
    }
  })
}

export const config = {
  matcher: [
    '/api/login',
    '/api/logout',
    '/api/refresh-token',
    '/',
    '/((?!_next|favicon.ico|api|.*\\.).*)'
  ],
}