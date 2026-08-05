import {
  BookText,
  Cpu,
  FolderGit2,
  FolderOpen,
  FolderTree,
  LayoutDashboard,
  MessageSquare,
  Tags,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { DashboardRoutes } from '@/lib/app-routes'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const dashboardNav: NavItem[] = [
  { label: 'Overview', href: DashboardRoutes.dashboard, icon: LayoutDashboard },
  { label: 'Portfolio', href: DashboardRoutes.projects, icon: FolderGit2 },
  { label: 'Categories', href: DashboardRoutes.categories, icon: FolderTree },
  { label: 'Tags', href: DashboardRoutes.tags, icon: Tags },
  { label: 'Technologies', href: DashboardRoutes.technologies, icon: Cpu },
  { label: 'Comments', href: DashboardRoutes.comments, icon: MessageSquare },
  { label: 'Stories', href: DashboardRoutes.stories, icon: BookText },
  { label: 'Users', href: DashboardRoutes.users, icon: Users },
  { label: 'Files', href: DashboardRoutes.files, icon: FolderOpen },
]

/**
 * A nav item is active when the path matches it exactly or is a child route.
 * The overview (`/`) matches only the exact root so it isn't always active.
 */
export const isActiveNavItem = (pathname: string, href: string): boolean => {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}
