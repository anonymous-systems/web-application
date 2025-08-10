import { JSX } from 'react'
import {
  NavigationMenu, NavigationMenuContent,
  NavigationMenuItem, NavigationMenuLink,
  NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle
} from '@workspace/ui/components/navigation-menu'
import { NavLink } from '@workspace/ui/models/interfaces/nav-link'
import Link from 'next/link'

interface Props {
  navLinks: NavLink[]
  className?: string
  viewport?: boolean
}
export const MainNavigation = (props: Props): JSX.Element => {

  return (
    <NavigationMenu className={`${props.className || ''}`} viewport={props.viewport}>
      <NavigationMenuList>
        {props.navLinks.map(link => (
          <NavigationMenuItem key={link.id}>
            <RenderNavLink link={link} />
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const RenderNavLink = ({ link }: { link: NavLink }): JSX.Element => {
  if (link.content) {
    return (
      <>
        <NavigationMenuTrigger>{link.name}</NavigationMenuTrigger>
        <NavigationMenuContent>{link.content}</NavigationMenuContent>
      </>
    )
  }
  return (
    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
      <Link href={link.href}>{link.name}</Link>
    </NavigationMenuLink>
  )
}