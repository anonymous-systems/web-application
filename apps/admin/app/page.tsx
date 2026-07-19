import { JSX } from 'react'
import Link from 'next/link'
import { cookies, headers } from 'next/headers'
import { getTokens } from 'next-firebase-auth-edge'
import { authConfig } from '@workspace/firebase-config/auth'
import { CompanyInformation } from '@workspace/ui/lib/company-information'
import { Button } from '@workspace/ui/components/button'
import { toUser } from '@/lib/to-user'
import { AppRoutes } from '@/lib/app-routes'

export default async function Page(): Promise<JSX.Element> {
  const tokens = await getTokens(
    await cookies(),
    { ...authConfig, headers: await headers() }
  )
  const user = tokens ? toUser(tokens) : null

  return (
    <main className="grid place-items-center min-h-svh p-8" data-testid="dashboardPage">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          {CompanyInformation.name} Admin
        </p>
        <h1 className="text-5xl font-bold">Admin Dashboard</h1>
        {user?.email && (
          <p className="text-muted-foreground">Signed in as {user.email}</p>
        )}
        <Link href={AppRoutes.signOut}>
          <Button variant="outline" data-testid="signOutButton">Sign out</Button>
        </Link>
      </div>
    </main>
  )
}
