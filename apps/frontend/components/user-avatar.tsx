import { JSX } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { User } from '@/interfaces/user'
import { cn } from '@workspace/ui/lib/utils'

interface Props {
  user: User
  className?: string
}
export const UserAvatar = (props: Props): JSX.Element => {
  const {user, className, ...restOfProps} = props

  return (
    <Avatar data-testid='userAvatar' className={cn(className, 'select-none')} {...restOfProps}>
      <AvatarImage
        src={user.photoURL ?? undefined}
        alt={user.displayName ?? undefined}
      />
      <AvatarFallback>
        {(user.displayName ?? user.email ?? '')[0]?.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}