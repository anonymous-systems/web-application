import { JSX } from 'react'
import { cookies, headers } from 'next/headers'
import { getTokens } from 'next-firebase-auth-edge'
import { authConfig } from '@workspace/firebase-config/auth'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar'
import { listUsers } from '@/services/user-service'
import { UserAdminToggle } from '@/components/users/user-admin-toggle'
import { RefreshButton } from '@/components/users/refresh-button'
import { AdminUser } from '@/interfaces/admin-user'

const fullName = (user: AdminUser): string => {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
  return name || user.displayName || 'Unnamed user'
}

const initials = (user: AdminUser): string => {
  const source = fullName(user)
  if (source === 'Unnamed user') return (user.email ?? '?').charAt(0).toUpperCase()
  return source
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const AccessBadge = ({ label }: { label: string }): JSX.Element => (
  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
    {label}
  </span>
)

export default async function Page(): Promise<JSX.Element> {
  const tokens = await getTokens(
    await cookies(),
    { ...authConfig, headers: await headers() }
  )
  const currentUid = tokens?.decodedToken.uid ?? null
  const users = await listUsers()

  return (
    <div className="flex flex-col gap-4" data-testid="usersPage">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground" data-testid="usersCount">
            {users.length} {users.length === 1 ? 'user' : 'users'}
          </p>
        </div>
        <RefreshButton />
      </div>

      <div className="rounded-lg border">
        <Table data-testid="usersTable">
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
            {users.map((user) => {
              const photo = user.avatar ?? user.photoURL

              return (
                <TableRow
                  key={user.uid}
                  data-testid="userRow"
                  data-email={user.email ?? ''}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {photo && <AvatarImage src={photo} alt="" />}
                        <AvatarFallback>{initials(user)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{fullName(user)}</span>
                        <span className="text-xs text-muted-foreground">
                          {user.email ?? 'No email'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.username ? `@${user.username}` : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {user.isAdmin && <AccessBadge label="Admin" />}
                      {user.isCreator && <AccessBadge label="Creator" />}
                      {!user.isAdmin && !user.isCreator && (
                        <span className="text-muted-foreground">Member</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <UserAdminToggle
                      uid={user.uid}
                      isAdmin={user.isAdmin}
                      isSelf={user.uid === currentUid}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
