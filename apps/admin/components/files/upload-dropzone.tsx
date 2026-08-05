'use client'

import { DragEvent, JSX, ReactNode, useState } from 'react'
import { cn } from '@workspace/ui/lib/utils'

interface Props {
  onFiles: (files: File[]) => void
  disabled?: boolean
  className?: string
  children: ReactNode
}

/** Wraps content so files dropped anywhere over it are uploaded. */
export const DropZone = ({
  onFiles,
  disabled = false,
  className,
  children,
}: Props): JSX.Element => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const files = Array.from(event.dataTransfer.files)
    if (files.length > 0) onFiles(files)
  }

  return (
    <div
      data-testid="fmDropzone"
      onDragOver={(event) => {
        event.preventDefault()
        if (!disabled) setIsDragging(true)
      }}
      onDragLeave={(event) => {
        // Ignore drags moving onto child elements.
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setIsDragging(false)
        }
      }}
      onDrop={handleDrop}
      className={cn(
        'relative rounded-lg',
        isDragging && 'outline-2 outline-dashed outline-primary outline-offset-2',
        className
      )}
    >
      {isDragging && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-primary/5 text-sm font-medium text-primary">
          Drop files to upload
        </div>
      )}
      {children}
    </div>
  )
}
