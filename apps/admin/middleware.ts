import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware, redirectToHome, redirectToLogin } from 'next-firebase-auth-edge'
import { authConfig } from '@workspace/firebase-config/auth'
import { AppRoutes, PublicRoutes } from '@/lib/app-routes'
import { hasAdminClaim } from '@/lib/admin-access'

const PUBLIC_PATHS = Object.values(PublicRoutes)

export const middleware = async (
  request: NextRequest
): Promise<NextResponse> => {
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

      const isAdmin = hasAdminClaim(decodedToken)

      // the sign-in page is the only entry point for non-admins
      if (pathname === AppRoutes.signIn) {
        // an authenticated admin has no reason to see the sign-in page
        if (isAdmin) return redirectToHome(request)
        // an authenticated non-admin stays so the "no access" notice can render
        return NextResponse.next({ request: { headers } })
      }

      // every other route is admin-only
      if (!isAdmin) {
        return redirectToLogin(request, { path: AppRoutes.signIn, publicPaths: PUBLIC_PATHS })
      }

      return NextResponse.next({ request: { headers } })
    },
    handleInvalidToken: async () => {
      const pathname = request.nextUrl.pathname

      // public routes are reachable without authentication
      if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next()

      return redirectToLogin(request, { path: AppRoutes.signIn, publicPaths: PUBLIC_PATHS })
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
