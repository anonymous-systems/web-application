'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { User } from '@/interfaces/user'
import { AuthProvider } from '@/providers/auth-provider'

interface Props {
  children: React.ReactNode
  user: User | null
}
export function Providers(props: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <AuthProvider user={props.user}>
        {props.children}
      </AuthProvider>
    </NextThemesProvider>
  )
}
