export interface NavLink {
  id: string
  name: string
  href: string
  icon?: React.ReactNode
  disabled?: boolean
  children?: NavLink[]
  onClick?: () => void
  className?: string
}