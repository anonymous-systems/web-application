'use client'

import { JSX, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import {
  HTMLMotionProps,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'
import { cn } from '@workspace/ui/lib/utils'
import { magneticOffset } from '@/lib/magnetic'

interface Props extends HTMLMotionProps<'div'> {
  /** Fraction of the pointer's distance from centre the element follows (0–1). */
  strength?: number
  /** Spring feel for both the pull and the snap-back. */
  spring?: { stiffness?: number; damping?: number }
}

const DEFAULT_SPRING = { stiffness: 150, damping: 15 }

const DEFAULT_STRENGTH = 0.15

/**
 * Wraps its child so it magnetically follows the mouse and springs back on
 * leave. Inert for touch and for reduced-motion users, so it never fights a tap
 * or accessibility — it only adds delight where a hover pointer exists.
 */
export const Magnetic = ({
  children,
  strength = DEFAULT_STRENGTH,
  spring,
  className,
  style,
  ...props
}: Props): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { ...DEFAULT_SPRING, ...spring }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const pull = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (prefersReducedMotion || event.pointerType !== 'mouse' || !ref.current) {
      return
    }

    const offset = magneticOffset(
      { x: event.clientX, y: event.clientY },
      ref.current.getBoundingClientRect(),
      strength
    )
    x.set(offset.x)
    y.set(offset.y)
  }

  const release = (): void => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      {...props}
      ref={ref}
      onPointerMove={pull}
      onPointerLeave={release}
      className={cn('inline-block', className)}
      style={{ ...style, x: springX, y: springY }}
    >
      {children}
    </motion.div>
  )
}
