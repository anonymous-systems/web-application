import { JSX } from 'react'
import { cookies, headers } from 'next/headers'
import { getTokens } from 'next-firebase-auth-edge'
import { authConfig } from '@workspace/firebase-config/auth'
import { toUser } from '@/lib/to-user'
import { hasAdminClaim } from '@/lib/admin-access'
import { AdminAuthCard } from '@/components/admin-auth-card'

export default async function SignInPage(): Promise<JSX.Element> {
  const tokens = await getTokens(
    await cookies(),
    { ...authConfig, headers: await headers() }
  )

  const user = tokens ? toUser(tokens) : null
  const unauthorized = user != null && !hasAdminClaim(user.customClaims)

  return (
    <main
      data-testid='signInPage'
      className='grid place-items-center min-h-svh bg-background p-8'
    >
      <AdminAuthCard unauthorized={unauthorized} />
    </main>
  )
}
