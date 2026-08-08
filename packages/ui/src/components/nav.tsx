'use client'

import { JSX, ReactNode, useEffect, useState } from 'react'
import { Button } from './button'
import { NavLink } from '../models/interfaces/nav-link'
import { MenuIcon } from '../assets/icons/menu-icon'
import { AnimatePresence, motion, stagger, Variants } from 'motion/react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { cn } from '../lib/utils'

/**
 * Where the compact header gives way to the full one. Expressed as a media
 * query *and* as Tailwind variants below, which must stay in step — the query
 * drives behaviour, the variants decide what is visible.
 */
const SMALL_SCREEN_QUERY = '(max-width: 834px)'
const ONLY_SMALL_SCREEN = 'min-[835px]:hidden'
const ONLY_LARGE_SCREEN = 'hidden min-[835px]:flex'

interface Props {
  children: ReactNode
  navLinks: NavLink[]
  smallScreenContent?: ReactNode
  content?: ReactNode
  className?: string
}

/**
 * Whether the viewport is below the breakpoint, false until mounted.
 *
 * Used only for behaviour — locking scroll, the expand animation, closing the
 * panel when the viewport grows. Nothing *rendered* may depend on it: this
 * component previously returned an empty fragment until it had measured the
 * window, which meant the header, the page and the footer were all absent from
 * the server-rendered HTML. Every page was effectively client-rendered, and a
 * crawler without JavaScript saw a blank document.
 */
const useIsSmallScreen = (): boolean => {
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(SMALL_SCREEN_QUERY)
    const sync = (): void => setIsSmallScreen(query.matches)

    sync()
    query.addEventListener('change', sync)
    return (): void => query.removeEventListener('change', sync)
  }, [])

  return isSmallScreen
}

const linkContainerVariants: Variants = {
  open: { transition: { delayChildren: stagger(0.07, { startDelay: 0.2 }) } },
  closed: { transition: { delayChildren: stagger(0.05, { from: 'last' }) } },
}

const linkVariants: Variants = {
  open: { opacity: 1, transition: { y: { stiffness: 1000, velocity: -100 } } },
  closed: { opacity: 0, transition: { y: { stiffness: 1000 }, duration: 0.1 } },
}

const HEADER_TRANSITION = { duration: 1, ease: [0.22, 1, 0.36, 1] as const }

export const Nav = ({
  children,
  navLinks,
  smallScreenContent,
  content,
  className,
}: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)
  const isSmallScreen = useIsSmallScreen()

  useEffect(() => {
    if (!isOpen) return

    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return (): void => {
      document.body.style.overflow = original
    }
  }, [isOpen])

  // The panel is hidden past the breakpoint, so a viewport that grows while it
  // is open would otherwise leave the header stuck at full height.
  useEffect(() => {
    if (!isSmallScreen) setIsOpen(false)
  }, [isSmallScreen])

  const expanded = isOpen && isSmallScreen

  return (
    <div className={cn('flex flex-col', className)}>
      <motion.header
        className={cn(
          'z-10 fixed w-full transition-colors',
          'max-w-[1024px] mx-auto align-self-center place-self-center',
          // Opaque while open: the panel covers the page, so there is nothing
          // behind it worth showing through.
          expanded ? 'bg-background flex flex-col' : 'glass'
        )}
        initial={false}
        animate={{
          height: expanded ? '100svh' : 'var(--header-height)',
          overflowY: expanded ? 'scroll' : 'visible',
          transition: HEADER_TRANSITION,
        }}
      >
        <div className="flex w-full gap-4 py-2 px-4">
          {smallScreenContent && (
            <div className={cn('flex w-full items-center gap-4', ONLY_SMALL_SCREEN)}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((current) => !current)}
              >
                <MenuIcon open={isOpen} />
              </Button>

              <motion.div
                className="flex-grow flex gap-4 items-center"
                animate={{
                  opacity: isOpen ? 0 : 1,
                  visibility: isOpen ? 'hidden' : 'visible',
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                {smallScreenContent}
              </motion.div>
            </div>
          )}

          {content && (
            <div className={cn('w-full items-center gap-4', ONLY_LARGE_SCREEN)}>
              {content}
            </div>
          )}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.ul
              className={cn(
                'flex flex-col gap-4 px-8 pt-8 pb-16 flex-grow',
                ONLY_SMALL_SCREEN
              )}
              variants={linkContainerVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {navLinks.map((link) => (
                <Link key={link.id} href={link.href} onClick={() => setIsOpen(false)}>
                  <motion.li
                    className={cn(
                      'group flex justify-between items-center',
                      'text-3xl font-semibold text-muted-foreground',
                      'hover:text-foreground transition-colors duration-300',
                      link.className
                    )}
                    variants={linkVariants}
                  >
                    {link.name}

                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {link.icon ?? <ChevronRight />}
                    </span>
                  </motion.li>
                </Link>
              ))}

              <motion.li className="mt-auto mx-auto" variants={linkVariants}>
                <ThemeToggle />
              </motion.li>
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="mt-[var(--header-height)] pt-4">{children}</main>
    </div>
  )
}
