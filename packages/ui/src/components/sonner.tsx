'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps, toast } from 'sonner'
import { CSSProperties, JSX } from 'react'

const Toaster = ({ ...props }: ToasterProps): JSX.Element => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster, toast }
