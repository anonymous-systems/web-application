'use server'

import { getTokens } from 'next-firebase-auth-edge'
import { cookies, headers } from 'next/headers'
import { authConfig } from '@workspace/firebase-config/auth'
import { refreshServerCookies } from 'next-firebase-auth-edge/next/cookies'
import { redirect } from 'next/navigation'
import { AppRoutes } from '@/lib/app-routes'

export const refreshCookies = async (): Promise<void> => {
  const tokens = await getTokens(await cookies(), authConfig)

  if (!tokens) {
    throw new Error('Unauthenticated user cannot refresh cookies')
  }

  await refreshServerCookies(
    await cookies(),
    new Headers(await headers()),
    authConfig
  )

  // Extract the current request URL from headers
  const referer = (await headers()).get('referer')
  let redirectPath = AppRoutes.profile

  if (referer) {
    const url = new URL(referer)
    const param = url.searchParams.get('redirect')
    // Optionally, validate the redirect path to avoid open redirects
    if (param && param.startsWith('/')) {
      redirectPath = param
    }
  }

  redirect(redirectPath)
}