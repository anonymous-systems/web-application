import { JSX } from 'react'
import { ChevronRightIcon, HomeIcon } from 'lucide-react'
import { Button } from '@workspace/ui/components/custom/button'

interface Props {
  path: string
  onNavigate: (path: string) => void
}

export const Breadcrumbs = ({ path, onNavigate }: Props): JSX.Element => {
  const segments = path ? path.split('/') : []

  return (
    <nav
      className="flex min-w-0 items-center gap-1 overflow-x-auto"
      aria-label="Breadcrumb"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onNavigate('')}
        disabled={path === ''}
        aria-label="Root folder"
        data-testid="fmHome"
      >
        <HomeIcon />
      </Button>

      {segments.map((segment, index) => {
        const crumbPath = segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1

        return (
          <span key={crumbPath} className="flex items-center gap-1">
            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              className="max-w-40 truncate"
              onClick={() => onNavigate(crumbPath)}
              disabled={isLast}
            >
              {segment}
            </Button>
          </span>
        )
      })}
    </nav>
  )
}
