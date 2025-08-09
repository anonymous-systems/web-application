import { JSX } from 'react'
import { User } from '@/interfaces/user'
import { AppRoutes } from '@/lib/app-routes'
import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu'
import { BadgeQuestionMark, LogOut, UserIcon } from 'lucide-react'
import { UserAvatar } from '@/components/user-avatar'
import { GithubIcon } from '@workspace/ui/assets/icons/github-icon'

interface Props {
  user: User | null
  isLoading?: boolean
  onSignOut?: () => Promise<void>
}
export const UserMenu = (props: Props): JSX.Element => {
  if (props.user == null) {
    return (
      <Link href={AppRoutes.signIn}>
        <Button variant='link' data-testid='signInButton'>Sign in</Button>
      </Link>
    )
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild disabled={props.isLoading}>
        <UserAvatar className='cursor-pointer' user={props.user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem asChild disabled={props.isLoading}>
          <Link href={AppRoutes.profile}>
            <UserIcon className='mr-4' />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <GithubIcon className='mr-4' />
          GitHub
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <BadgeQuestionMark className='mr-4' />
          Support
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={props.onSignOut} disabled={props.isLoading}>
          <LogOut className='mr-4' />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}