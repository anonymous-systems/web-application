import { JSX, ReactNode } from 'react'
import { cookies, headers } from 'next/headers'
import { getTokens } from 'next-firebase-auth-edge'
import { authConfig } from '@workspace/firebase-config/auth'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@workspace/ui/components/sidebar'
import { Separator } from '@workspace/ui/components/separator'
import { ThemeToggle } from '@workspace/ui/components/theme-toggle'
import { toUser } from '@/lib/to-user'
import { AppSidebar } from '@/components/dashboard/app-sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}): Promise<JSX.Element> {
  const tokens = await getTokens(
    await cookies(),
    { ...authConfig, headers: await headers() }
  )
  const user = tokens ? toUser(tokens) : null

  return (
    <SidebarProvider>
      <AppSidebar email={user?.email ?? null} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
