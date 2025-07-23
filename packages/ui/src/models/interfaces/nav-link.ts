import { ReactNode } from 'react'

export interface NavLink {
  id: string
  name: string
  href: string
  icon?: ReactNode
  disabled?: boolean
  children?: NavLink[]
  onClick?: () => void
  className?: string
  content?: ReactNode
}