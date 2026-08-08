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
  // A template rather than a bare title, so each page reads as "<Page> |
  // Anonymous Systems" without every route restating the brand.
  title: {
    default: CompanyInformation.title,
    template: `%s | ${CompanyInformation.name}`,
  },
  description: CompanyInformation.byline,
  // Resolves the relative URLs in the Open Graph tags below. Without it Next
  // warns and social cards fall back to a bare domain.
  metadataBase: new URL(CompanyInformation.website),
  openGraph: {
    type: 'website',
    siteName: CompanyInformation.name,
    title: CompanyInformation.title,
    description: CompanyInformation.byline,
    url: CompanyInformation.website,
  },
  twitter: {
    card: 'summary_large_image',
    site: CompanyInformation.socials.twitter,
  },
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
        {/* No <title> here — Next renders it from the `metadata` export above.
            Hardcoding one emitted a second, generic title on every page that
            defines its own. */}
      </head>
      <body className='antialiased'>
        <Providers user={user}>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
