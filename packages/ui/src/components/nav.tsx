'use client'

import { JSX, ReactNode, useEffect, useState } from 'react'
import { Button } from './button'
import { NavLink } from '../models/interfaces/nav-link'
import { MenuIcon } from '../assets/icons/menu-icon'
import { AnimatePresence, motion, stagger, Variants, resize } from 'motion/react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

const SMALL_SCREEN_MAX_WIDTH = 834

interface Props {
  children: ReactNode
  navLinks: NavLink[]
  smallScreenContent?: ReactNode
  content?: ReactNode
  smallScreenMaxWidth?: number
  className?: string
  headerClassName?: string
}

// Hook to check if component has mounted (avoids SSR hydration issues)
const useHasMounted = (): boolean => {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  return hasMounted
}

// Window width hook, only runs on client
const useWindowWidth = (): number | null => {
  const [width, setWidth] = useState<number | null>(null)
  useEffect(() => {
    setWidth(window.innerWidth)
    const unsubscribe = resize(({ width: w }) => setWidth(w))
    return (): void => unsubscribe()
  }, [])
  return width
}

export const Nav = (props: Props): JSX.Element => {
  const smallScreenMaxWidth = props.smallScreenMaxWidth ?? SMALL_SCREEN_MAX_WIDTH
  const [isOpen, setIsOpen] = useState(false)
  const hasMounted = useHasMounted()
  const width = useWindowWidth()
  const isSmallScreen = hasMounted && width !== null && width <= smallScreenMaxWidth

  // Lock body scroll when nav is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return (): void => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  // Close nav on small screens when window resizes to larger than small screen width
  useEffect(() => {
    if (!isSmallScreen && isOpen) setIsOpen(false)
  }, [isSmallScreen, isOpen])

  const linkContainerVariants: Variants = {
    open: {
      transition: { delayChildren: stagger(0.07, { startDelay: 0.2 }), }
    },
    closed: {
      transition: { delayChildren: stagger(0.05, { from: 'last' }) }
    }
  }

  const linkVariants: Variants = {
    open: {
      opacity: 1,
      transition: { y: { stiffness: 1000, velocity: -100 } }
    },
    closed: {
      opacity: 0,
      transition: { y: { stiffness: 1000 }, duration: 0.1 }
    }
  }

  const smallScreenContent = (): JSX.Element | null => {
    if (props.smallScreenContent == null) return null
    return (
      <motion.div
        className='flex w-full items-center gap-4'
      >
        <Button variant='ghost' size='icon' onClick={() => { setIsOpen(prev => !prev) }}>
          <MenuIcon open={isOpen} />
        </Button>
        <motion.div
          className='flex-grow flex gap-4 items-center'
          initial={{
            opacity: 1,
            visibility: 'visible',
            transition: { duration: 0.4, ease: 'easeInOut' }
          }}
          animate={isOpen
            ? ({
              opacity: 0,
              visibility: 'hidden'
            })
            : ({
              opacity: 1,
              visibility: 'visible',
              transition: { duration: 0.4, ease: 'easeInOut' }
            })
          }
        >
          {props.smallScreenContent}
        </motion.div>
      </motion.div>
    )
  }

  const content = (): JSX.Element | null => {
    if (props.content == null) return null

    return <>{props.content}</>
  }

  if (!hasMounted || width == null) return <></>

  return (
    <div className={`flex flex-col ${props.className || ''}`}>
      <motion.header
        className={[
          'z-10 fixed w-full transition-colors',
          'max-w-[1024px] mx-auto align-self-center',
          'place-self-center',
          isOpen ? 'bg-background' : 'bg-background/20',
          isOpen ? 'flex flex-col' : '',
          props.headerClassName || ''
        ].join(' ')}
        initial={{
          height: 'var(--header-height)',
          overflowY: 'visible',
          transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
        }}
        animate={isOpen
          ? ({
            height: '100svh',
            overflowY: 'scroll',
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
          })
          : ({
            height: 'var(--header-height)',
            overflowY: 'visible',
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
          })
        }
        style={{ backdropFilter: 'saturate(180%) blur(20px)' }}
      >
        <div className='flex w-full gap-4 py-2 px-4'>
          {isSmallScreen ? smallScreenContent() : content()}
        </div>

        <AnimatePresence>
          {isOpen && isSmallScreen && (
            <>
              <motion.ul
                className='flex flex-col gap-4 px-8 pt-8 pb-16 flex-grow'
                variants={linkContainerVariants}
                initial='closed'
                animate='open'
                exit='closed'
              >
                {props.navLinks.map((link, index) => (
                  <Link key={`${link.id}-${index}`} href={link.href}>
                    <motion.li
                      className={[
                        'group flex justify-between items-center',
                        'text-3xl font-semibold text-muted-foreground',
                        'hover:text-foreground transition-colors duration-300',
                        link.className ?? ''
                      ].join(' ')}
                      variants={linkVariants}
                    >
                      {link.name}

                      <span
                        className='ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                      >
                        {link.icon ?? <ChevronRight />}
                      </span>
                    </motion.li>
                  </Link>
                ))}
                <motion.li
                  className='mt-auto mx-auto'
                  variants={linkVariants}
                >
                  <ThemeToggle />
                </motion.li>
              </motion.ul>
            </>
          )}
        </AnimatePresence>
      </motion.header>
      <main className='mt-[var(--header-height)] pt-4'>
        {props.children}
      </main>
    </div>
  )
}