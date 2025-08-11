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
      const pathname = request.nextUrl.pathname

      if (pathname === AppRoutes.signOut) {
        return NextResponse.next({ request: { headers } })
      }

      const userCompletedOnboarding = decodedToken.onboardingComplete || false
      // authenticated user tries to access onboarding page
      if (pathname === AppRoutes.onboarding) {
        // onboarding is completed, redirect to home page
        if (userCompletedOnboarding) return redirectToHome(request)
        // onboarding is not completed, continue to onboarding page
        return NextResponse.next({ request: { headers } })
      }

      // authenticated user tries to access an auth route (except onboarding)
      if (AUTH_PATHS.includes(pathname)) return redirectToHome(request)

      // authenticated user, onboarding not complete, tries to access a private path (not onboarding)
      if (!userCompletedOnboarding && PRIVATE_PATHS.includes(pathname)) {
        return redirectToLogin(
          request,
          { path: AppRoutes.onboarding, publicPaths: PUBLIC_PATHS }
        )
      }

      // allow access to public and private paths
      return NextResponse.next({ request: { headers } })
    },
    handleInvalidToken: async () => {
      const pathname = request.nextUrl.pathname

      if (pathname === AppRoutes.signOut) return NextResponse.next()

      // unauthenticated user tries to access onboarding: redirect to sign-in
      if (pathname === AppRoutes.onboarding) {
        return redirectToLogin(
          request,
          { path: AppRoutes.signIn, publicPaths: PUBLIC_PATHS }
        )
      }

      // unauthenticated user tries to access private route: redirect to sign-in
      if (PRIVATE_PATHS.includes(pathname)) {
        return redirectToLogin(
          request,
          { path: AppRoutes.signIn, publicPaths: PUBLIC_PATHS }
        )
      }

      // allow access to public and auth routes
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