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
import { SiteFooter } from '@/components/site-footer'
import { CommandBar } from '@/components/command-bar'

interface Props {
  children: ReactNode
  dataTestId?: string
}
export const Layout = (props: Props): JSX.Element => {
  const { user } = useAuth()

  // Only destinations a visitor should browse to. Welcome and Onboarding were
  // here too, but they are steps in the sign-up flow rather than places — and
  // Profile is reached from the user menu, which is where a signed-in reader
  // already looks for it.
  const navLinks: NavLink[] = [
    { id: 'home', name: 'Home', href: AppRoutes.home },
    { id: 'stories', name: 'Stories', href: AppRoutes.stories },
    { id: 'portfolio', name: 'Portfolio', href: AppRoutes.portfolio },
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

      <SiteFooter />

      {/* The theme toggle used to float here on its own; it now sits in the
          command bar, so the bottom of the screen holds one control rather
          than two competing for the same corner. */}
      <CommandBar />
    </Nav>
  )
}