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
import { LogOut, UserIcon } from 'lucide-react'
import { UserAvatar } from '@/components/user-avatar'
import { GithubIcon } from '@workspace/ui/assets/icons/github-icon'
import { CompanyInformation } from '@workspace/ui/lib/company-information'

interface Props {
  user: User | null
}
export const UserMenu = (props: Props): JSX.Element => {
  if (props.user == null) {
    return (
      <Link href={AppRoutes.signIn}>
        <Button variant='link' data-testid='signInButton'>Sign in</Button>
      </Link>
    )
  }

  const gitHubUrl = `https://github.com/${CompanyInformation.socials.github}`

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <UserAvatar className='cursor-pointer' user={props.user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={AppRoutes.profile}>
            <UserIcon className='mr-4' />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={gitHubUrl} target='_blank' rel='noreferrer'>
            <GithubIcon className='mr-4' />
            GitHub
          </Link>
        </DropdownMenuItem>
        {/*<DropdownMenuItem disabled>*/}
        {/*  <MessageCircleQuestionMark className='mr-4' />*/}
        {/*  Support*/}
        {/*</DropdownMenuItem>*/}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={AppRoutes.signOut}>
            <LogOut className='mr-4' />
            Sign Out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}