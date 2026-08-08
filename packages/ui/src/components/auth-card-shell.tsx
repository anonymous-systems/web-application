import { JSX, ReactNode } from 'react'
import { cn } from '../lib/utils'

interface Props {
  children: ReactNode
  className?: string
  dataTestId?: string
}

/**
 * The bordered panel behind the standalone auth surfaces — sign in, sign up,
 * sign out, onboarding and welcome, in both apps.
 *
 * Extracted because all six copied the same three lines of Tailwind, so the
 * panel could drift in one place and nowhere else. They stay separate
 * components: they share this frame, not their contents.
 */
export const AuthCardShell = ({
  children,
  className,
  dataTestId,
}: Props): JSX.Element => (
  <div
    className={cn(
      'bg-card text-card-foreground flex max-w-[400px] flex-col gap-4 rounded-lg p-8 shadow-sm outline',
      className
    )}
    data-testid={dataTestId}
  >
    {children}
  </div>
)
