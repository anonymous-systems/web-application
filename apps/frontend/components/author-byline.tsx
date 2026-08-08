import { JSX } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { initialsFrom } from '@workspace/ui/lib/initials'
import { AppRoutes } from '@/lib/app-routes'

interface Props {
  name: string | null
  avatar: string | null
  /** Null for authors who never completed onboarding, so have no profile page. */
  username: string | null
}

/**
 * The author's avatar and name, linked to their public profile.
 *
 * Only linked when a username exists: content migrated from the previous app
 * has an author reference but no onboarded profile behind it, and a link to
 * `/u/null` would be a 404 dressed up as a byline.
 *
 * Used on the detail pages only. The cards deliberately do not link the author
 * — their title is a stretched link covering the whole card, so a second anchor
 * inside would be both invalid markup and unclickable.
 */
export const AuthorByline = ({ name, avatar, username }: Props): JSX.Element => {
  const identity = (
    <>
      <Avatar className="size-8">
        {avatar && <AvatarImage src={avatar} alt="" />}
        <AvatarFallback className="text-xs">{initialsFrom(name)}</AvatarFallback>
      </Avatar>
      {name && <span>{name}</span>}
    </>
  )

  if (!username) {
    return <span className="flex items-center gap-2">{identity}</span>
  }

  return (
    <Link
      href={AppRoutes.publicProfile(username)}
      className="hover:text-foreground flex items-center gap-2 transition-colors"
      data-testid="authorProfileLink"
    >
      {identity}
    </Link>
  )
}
