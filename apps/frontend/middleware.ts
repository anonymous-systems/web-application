import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware, redirectToHome, redirectToLogin } from 'next-firebase-auth-edge'
import { authConfig } from '@workspace/firebase-config/auth'
import { AppRoutes, AuthRoutes, PublicRoutes } from '@/lib/app-routes'

const AUTH_PATHS = Object.values(AuthRoutes)
const PUBLIC_PATHS = Object.values(PublicRoutes)

export const middleware = async (request: NextRequest) => {
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    apiKey: authConfig.apiKey,
    cookieName: authConfig.cookieName,
    cookieSignatureKeys: authConfig.cookieSignatureKeys,
    cookieSerializeOptions: authConfig.cookieSerializeOptions,
    enableMultipleCookies: authConfig.enableMultipleCookies,
    enableCustomToken: authConfig.enableCustomToken,
    serviceAccount: authConfig.serviceAccount,
    handleValidToken: async (_, headers) => {
      if (AUTH_PATHS.includes(request.nextUrl.pathname)) {
        console.debug('User is authenticated, redirecting to home page')
        return redirectToHome(request)
      }

      return NextResponse.next({ request: { headers } })
    },
    handleInvalidToken: async (reason) => {
      // console.debug('Missing or malformed credentials', {reason})
      if (!PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
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
  matcher: ["/api/login", "/api/logout", "/", "/((?!_next|favicon.ico|api|.*\\.).*)"],
}