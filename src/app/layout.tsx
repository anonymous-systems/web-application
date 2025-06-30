import type { Metadata } from 'next'
import { ReactNode } from 'react'
import '../styles/global.css'

export const metadata: Metadata = {
  title: 'Anonymous Systems',
  description: 'Michigan Technology Consultant: Helping Businesses Grow with Technology',
}

interface Props {
  children: ReactNode
}
export default function AppLayout(props: Props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        <title>{metadata.title as string}</title>
      </head>
      <body>
        {props.children}
      </body>
    </html>
  )
}
