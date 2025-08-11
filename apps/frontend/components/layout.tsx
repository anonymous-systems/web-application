'use client'

import { JSX, ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Nav } from '@workspace/ui/components/nav'
import { AppRoutes } from '@/lib/app-routes'
import { BrandName } from '@workspace/ui/components/brand-name'
import Link from 'next/link'
import { NavLink } from '@workspace/ui/models/interfaces/nav-link'
import { UserMenu } from '@/components/user-menu'
import { MainNavigation } from '@/components/main-navigation'
import { ThemeToggle } from '@workspace/ui/components/theme-toggle'

interface Props {
  children: ReactNode
  dataTestId?: string
}
export const Layout = (props: Props): JSX.Element => {
  const { user } = useAuth()

  const navLinks: NavLink[] = [
    { id: 'home', name: 'Home', href: AppRoutes.home },
    { id: 'welcome', name: 'Welcome', href: AppRoutes.welcome },
    { id: 'profile', name: 'Profile', href: AppRoutes.profile },
    { id: 'onboarding', name: 'Onboarding', href: AppRoutes.onboarding },
  ]

  return (
    <Nav
      navLinks={navLinks}
      smallScreenContent={
        <>
          <Link href={AppRoutes.home}>
            <BrandName />
          </Link>

          <div className='flex-grow flex justify-end'>
            <UserMenu user={user} />
          </div>
        </>
      }
      content={
        <>
          <Link href={AppRoutes.home}>
            <BrandName />
          </Link>

          <MainNavigation className='flex-grow max-w-none' viewport={false} navLinks={navLinks} />

          <UserMenu user={user} />
        </>
      }
    >
      <main data-testid={props.dataTestId}>{props.children}</main>

      <ThemeToggle className='fixed bottom-6 right-4' />
    </Nav>
  )
}