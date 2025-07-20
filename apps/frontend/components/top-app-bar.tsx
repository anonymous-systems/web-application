import { JSX } from 'react'
import { User } from '@/interfaces/user'
import Link from 'next/link'
import { AppRoutes } from '@/lib/app-routes'
import { BrandName } from '@workspace/ui/components/brand-name'
import { Button } from '@workspace/ui/components/button'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu'
import { LogOut } from 'lucide-react'

interface Props {
  user: User | null
  onSignOut: () => void
  isLoading?: boolean
}
export const TopAppBar = (props: Props): JSX.Element => {
  return (
    <header className='flex items-center w-full gap-4 py-2 px-4'>
      <Link href={AppRoutes.home}>
        <BrandName />
      </Link>

      <div className='flex-grow flex justify-end'>
        {props.user == null
        ? (
          <Link href={AppRoutes.signIn}>
            <Button variant='link'>Sign in</Button>
          </Link>
        )
        : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={props.isLoading}>
              <Avatar className='cursor-pointer'>
                <AvatarImage
                  src={props.user.photoURL ?? undefined}
                  alt={props.user.displayName ?? undefined}
                />
                <AvatarFallback>
                  {(props.user.displayName ?? props.user.email ?? '')[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={props.onSignOut} disabled={props.isLoading}>
                <LogOut className='mr-4' />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}