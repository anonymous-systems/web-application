import { Inter } from 'next/font/google'

import '@workspace/ui/globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@workspace/ui/components/sonner'
import { CompanyInformation } from '@workspace/ui/lib/company-information'
import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: CompanyInformation.name,
  description: CompanyInformation.byline,
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="initial-scale=1, width=device-width"/>
        <link rel="icon" href="/favicon.ico"/>
        <title>{metadata.title as string}</title>
      </head>
      <body
        className={`${inter.className} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
