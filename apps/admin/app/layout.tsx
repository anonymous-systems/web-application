import { Inter, Inter_Tight } from 'next/font/google'

import '@workspace/ui/globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@workspace/ui/components/sonner'
import { CompanyInformation } from '@workspace/ui/lib/company-information'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: CompanyInformation.name,
  description: CompanyInformation.byline,
}

const inter = Inter({ subsets: ['latin'] })

interface Props {
  children: React.ReactNode
}
export default function RootLayout(props: Readonly<Props>) {
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
        <Providers>{props.children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
