'use client'

import { JSX } from 'react'
import { useTheme } from 'next-themes'
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'

enum THEMES {
  Light = 'light',
  Dark = 'dark',
  System = 'system'
}

interface Props {
  className?: string
}
export const ThemeToggle = (props: Props): JSX.Element => {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={props.className} asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(THEMES).map(([k,v]) => (
          <DropdownMenuItem key={k} className={theme === v ? 'bg-accent text-accent-foreground' : undefined} onClick={() => setTheme(v)}>
            {k}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}