import { JSX } from 'react'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}
export const Divider = (props: Props): JSX.Element => {
  const { orientation = 'horizontal', className } = props
  const orientationClass = orientation === 'vertical'
    ? 'w-px h-full'
    : 'h-px w-full'

  return (
    <hr
      role='separator'
      aria-orientation={orientation}
      className={[
        'bg-gray-300 rounded-xl border-none',
        orientationClass,
        className
      ].join(' ')}
    />

  )
}