'use client'

import { JSX, ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@workspace/ui/lib/utils'

interface Props {
  children: ReactNode
  className?: string
  /** Seconds to hold before starting, for staggering siblings. */
  delay?: number
}

// Slow enough to read as deliberate, short enough not to be waited on. Matched
// to the spring in `<Magnetic>` so the two feel like one system.
const TRANSITION = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }

// A small rise only. A large one turns scrolling into a sequence of arrivals,
// which reads as a slideshow rather than a page.
const RISE = 16

/**
 * Fades its children in, rising slightly, the first time they scroll into view.
 *
 * Once only: re-animating on every pass makes a page feel unstable when a reader
 * scrolls back to something they have already seen. Inert under reduced motion —
 * the content renders in place rather than being animated to full opacity, so it
 * can never be left invisible if the animation does not run.
 */
export const Reveal = ({ children, className, delay = 0 }: Props): JSX.Element => {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: RISE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ ...TRANSITION, delay }}
    >
      {children}
    </motion.div>
  )
}
