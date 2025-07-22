'use client'

import { JSX, ReactNode, useEffect, useState } from 'react'
import { Button } from '@workspace/ui/components/button'
import { NavLink } from '@workspace/ui/models/interfaces/nav-link'
import { MenuIcon } from '@workspace/ui/assets/icons/menu-icon'
import { AnimatePresence, motion } from 'motion/react'
// @ts-expect-error Import not registering in this project properly
import Link from 'next/link'
import { stagger, Variants } from 'motion'

interface Props {
  children: ReactNode
  content?: ReactNode
  navLinks: NavLink[]
}
export const Nav = (props: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)

  // Lock body scroll when nav is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  const navVariants: Variants = {
    closed: {
      height: 'var(--header-height)',
      overflowY: 'hidden',
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    },
    open: {
      height: '100svh',
      overflowY: 'scroll',
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const headerVariants: Variants = {
    open: {
      opacity: 0,
      visibility: 'hidden'
    },
    closed: {
      opacity: 1,
      visibility: 'visible',
      transition: { duration: 0.4, ease: "easeInOut" }
    },
  };

  const linkContainerVariants: Variants = {
    open: {
      transition: { delayChildren: stagger(0.07, { startDelay: 0.2 }), }
    },
    closed: {
      transition: { delayChildren: stagger(0.05, { from: 'last' }) }
    }
  };

  const linkVariants: Variants = {
    open: {
      opacity: 1,
      transition: { y: { stiffness: 1000, velocity: -100 } }
    },
    closed: {
      opacity: 0,
      transition: { y: { stiffness: 1000 }, duration: 0.1 }
    }
  };

  return (
    <div className='flex flex-col'>
      <motion.header
        className={`z-10 fixed w-full transition-colors ${isOpen ? 'bg-background' : 'bg-background/20'}`}
        initial='closed'
        animate={isOpen ? 'open' : 'closed'}
        variants={navVariants}
        style={{
          backdropFilter: 'saturate(180%) blur(20px)'
        }}
      >
        <nav className={`flex w-full gap-4 py-2 px-4 ${isOpen ? '' : 'items-center'}`}>
          <Button variant='ghost' size='icon' onClick={() => { setIsOpen(prev => !prev) }}>
            <MenuIcon open={isOpen} />
          </Button>

          {props.content != null && (
            <AnimatePresence>
              <motion.div
                  className='flex-grow flex gap-4 items-center'
                  variants={headerVariants}
                  initial='closed'
                  animate={isOpen ? 'open' : 'closed'}
                >
                  {props.content}
                </motion.div>
            </AnimatePresence>
          )}
        </nav>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
                className='flex flex-col gap-4 px-8 pt-8 pb-16 flex-grow'
                variants={linkContainerVariants}
                initial='closed'
                animate='open'
                exit='closed'
              >
                {props.navLinks.map((link, index) => (
                  <motion.li
                    key={`${link.id}-${index}`}
                    className={`text-3xl font-semibold text-muted-foreground hover:text-foreground transition-colors duration-300 ${link.className}`}
                    variants={linkVariants}
                  >
                    <Link href={link.href}>{link.name}</Link>
                  </motion.li>
                ))}
              </motion.ul>
          )}
        </AnimatePresence>
      </motion.header>
      <main className='mt-[var(--header-height)] pt-4'>
        {props.children}
      </main>
    </div>
  )
}