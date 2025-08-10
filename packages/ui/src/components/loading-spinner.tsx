import { JSX } from 'react'
import { motion } from 'motion/react'
import { cn } from '@workspace/ui/lib/utils'

interface Props {
  className?: string
}
export const LoadingSpinner = (props: Props): JSX.Element => {
  return (
    <motion.div
      className={cn(
        'rounded-full border-4 border-primary/60 border-t-transparent w-12 h-12',
        props.className
      )}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.85, ease: 'linear' }}
      style={{ borderTopColor: 'transparent' }}
    />
  )
}