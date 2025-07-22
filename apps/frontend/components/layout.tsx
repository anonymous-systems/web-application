'use client'

import { JSX, ReactNode, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@workspace/ui/components/sonner'
import { useRouter } from 'next/navigation'
import { Nav } from '@workspace/ui/components/nav'
import { AppRoutes } from '@/lib/app-routes'
import { BrandName } from '@workspace/ui/components/brand-name'
import Link from 'next/link'
import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { LogOut } from 'lucide-react'
import { NavLink } from '@workspace/ui/models/interfaces/nav-link'

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

  // const manyNavLinks: NavLink[] = [
  //   ...Array(4).fill(Object.entries(AppRoutes)).flat().map(([k,v]) => ({
  //     id: k,
  //     name: k,
  //     href: v,
  //   }))
  // ]

  const navLinks: NavLink[] = [
    ...Object.entries(AppRoutes).map(([k,v]) => ({
      id: k,
      name: k,
      href: v,
    }))
  ]

  return (
    <Nav
      navLinks={navLinks}
      content={
        <>
          <Link href={AppRoutes.home}>
            <BrandName />
          </Link>

          <div className='flex-grow flex justify-end'>
            {user == null
            ? (
              <Link href={AppRoutes.signIn}>
                <Button variant='link'>Sign in</Button>
              </Link>
            )
            : (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild disabled={isLoading}>
                  <Avatar className='cursor-pointer'>
                    <AvatarImage
                      src={user.photoURL ?? undefined}
                      alt={user.displayName ?? undefined}
                    />
                    <AvatarFallback>
                      {(user.displayName ?? user.email ?? '')[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={handleSignOut} disabled={isLoading}>
                    <LogOut className='mr-4' />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </>
      }
    >
      <main>{props.children}<div className='min-h-svh'></div></main>
    </Nav>
  )
}