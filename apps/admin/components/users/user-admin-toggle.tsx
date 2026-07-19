'use client'

import { JSX, useTransition } from 'react'
import {
  Loader2Icon,
  MoreHorizontalIcon,
  ShieldCheckIcon,
  ShieldOffIcon,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { Button } from '@workspace/ui/components/custom/button'
import { toast } from '@workspace/ui/components/sonner'
import { setAdminAccess } from '@/app/(dashboard)/users/actions'

interface Props {
  uid: string
  isAdmin: boolean
  /** True for the currently signed-in admin — they can't change their own access. */
  isSelf: boolean
}

export const UserAdminToggle = ({ uid, isAdmin, isSelf }: Props): JSX.Element => {
  const [isPending, startTransition] = useTransition()

  const handleToggle = (): void => {
    startTransition(async () => {
      const result = await setAdminAccess(uid, !isAdmin)
      if (result.ok) {
        toast.success(isAdmin ? 'Admin access revoked.' : 'Admin access granted.')
      } else {
        toast.error(result.error ?? 'Something went wrong.')
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          loading={isPending}
          aria-label="User actions"
          data-testid="userActionsTrigger"
        >
          {isPending
            ? <Loader2Icon className="animate-spin" />
            : <MoreHorizontalIcon />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={isSelf || isPending}
          onClick={handleToggle}
          data-testid="toggleAdminItem"
        >
          {isAdmin ? <ShieldOffIcon /> : <ShieldCheckIcon />}
          {isAdmin ? 'Revoke admin' : 'Grant admin'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
