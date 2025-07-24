'use client'

import { JSX, ReactNode, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@workspace/ui/components/sonner'
import { useRouter } from 'next/navigation'
import { Nav } from '@workspace/ui/components/nav'
import { AppRoutes } from '@/lib/app-routes'
import { BrandName } from '@workspace/ui/components/brand-name'
import Link from 'next/link'
import { NavLink } from '@workspace/ui/models/interfaces/nav-link'
import { UserMenu } from '@/components/user-menu'
import { MainNavigation } from '@/components/main-navigation'
import { WelcomeCard } from '@/app/welcome/_components/WelcomeCard'

interface Props {
  children: ReactNode
}
export const Layout = (props: Props): JSX.Element => {
  const { user, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async (): Promise<void> => {
    setIsLoading(true)
    const success = await signOut()
    if (success) {
      toast.success('You have been signed out successfully.')
      router.refresh()
    } else {
      toast.error('Something went wrong while signing out.')
    }
    setIsLoading(false)
  }

  const navLinks: NavLink[] = [
    { id: 'home', name: 'Home', href: AppRoutes.home },
    { id: 'welcome', name: 'Welcome', href: AppRoutes.welcome, content: <WelcomeCard /> },
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
            <UserMenu user={user} isLoading={isLoading} onSignOut={handleSignOut} />
          </div>
        </>
      }
      content={
        <>
          <Link href={AppRoutes.home}>
            <BrandName />
          </Link>

          <MainNavigation className='flex-grow max-w-none' viewport={false} navLinks={navLinks} />
          {/*<NavigationMenuDemo />*/}

          <UserMenu user={user} isLoading={isLoading} onSignOut={handleSignOut} />
        </>
      }
    >
      <main>{props.children}</main>
    </Nav>
  )
}