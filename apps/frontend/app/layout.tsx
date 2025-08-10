import '@workspace/ui/globals.css'
import { Inter, Nunito } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from '@workspace/ui/components/sonner'
import { Metadata } from 'next'
import { CompanyInformation } from '@workspace/ui/lib/company-information'
import { getTokens } from 'next-firebase-auth-edge'
import { cookies, headers } from 'next/headers'
import { toUser } from '@/lib/to-user'
import { JSX, ReactNode } from 'react'
import { authConfig } from '@workspace/firebase-config/auth'

const inter = Inter({ subsets: ['latin'] })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })

export const metadata: Metadata = {
  title: CompanyInformation.name,
  description: CompanyInformation.byline,
}

export default async function AppLayout({ children }: { children: ReactNode }): Promise<JSX.Element> {
  const tokens = await getTokens(
    await cookies(),
    { ...authConfig, headers: await headers() }
  )

  const user = tokens ? toUser(tokens) : null

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.className} ${nunito.variable}`}>
      <head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="initial-scale=1, width=device-width"/>
        <link rel="icon" href="/favicon.ico"/>
        <title>{metadata.title as string}</title>
      </head>
      <body className='antialiased'>
        <Providers user={user}>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
