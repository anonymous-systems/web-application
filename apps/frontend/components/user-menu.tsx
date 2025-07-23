import { JSX } from 'react'
import { User } from '@/interfaces/user'
import { AppRoutes } from '@/lib/app-routes'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { LogOut } from 'lucide-react'

interface Props {
  user: User | null
  isLoading?: boolean
  onSignOut?: () => Promise<void>
}
export const UserMenu = (props: Props): JSX.Element => {
  if (props.user == null) {
    return (
      <Link href={AppRoutes.signIn}>
        <Button variant='link'>Sign in</Button>
      </Link>
    )
  }

  return (
    <DropdownMenu modal={false}>
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
  )
}