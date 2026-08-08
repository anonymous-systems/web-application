'use client'

import { JSX, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Briefcase,
  Home,
  Mail,
  Search,
  type LucideIcon,
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command'
import { ThemeToggle } from '@workspace/ui/components/theme-toggle'
import { CompanyInformation } from '@workspace/ui/lib/company-information'
import { cn } from '@workspace/ui/lib/utils'
import { AppRoutes } from '@/lib/app-routes'
import { loadSearchIndex, type SearchResult } from '@/lib/search-index'

interface Destination {
  name: string
  href: string
  Icon: LucideIcon
}

const destinations: Destination[] = [
  { name: 'Home', href: AppRoutes.home, Icon: Home },
  { name: 'Stories', href: AppRoutes.stories, Icon: BookOpen },
  { name: 'Portfolio', href: AppRoutes.portfolio, Icon: Briefcase },
]

/**
 * The floating command bar: quick navigation on the left, search on the right,
 * over the same frosted glass as the header.
 *
 * Anchored to the bottom because that is where a thumb rests — the primary
 * navigation lives in the header, which on a phone is the furthest point from
 * the hand holding it.
 *
 * The palette is lazy: the search index is fetched the first time it opens
 * rather than on every page load, so a reader who never searches pays nothing
 * for it.
 */
export const CommandBar = (): JSX.Element => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return (): void => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!open || results !== null) return

    loadSearchIndex()
      .then(setResults)
      // Search is an accelerator, not the way around the site, so a failure
      // leaves the destinations below usable rather than emptying the palette.
      .catch((error) => {
        console.error('Failed to load the search index', error)
        setFailed(true)
        setResults([])
      })
  }, [open, results])

  const go = useCallback(
    (href: string): void => {
      setOpen(false)
      router.push(href)
    },
    [router]
  )

  const stories = results?.filter((result) => result.kind === 'story') ?? []
  const projects = results?.filter((result) => result.kind === 'project') ?? []

  return (
    <>
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-20 flex justify-center',
          // Clears the iOS home indicator, which otherwise sits over the bar.
          'px-4 pb-[max(1rem,env(safe-area-inset-bottom))]'
        )}
      >
        <nav
          aria-label="Quick navigation"
          // Barely any blur: the pill is small and surrounded by page, so a
          // heavy one frosts it into a solid lozenge instead of reading as glass.
          className="glass [--glass-blur:5px] flex items-center gap-1 rounded-full border p-1.5 shadow-lg"
          data-testid="commandBar"
        >
          {destinations.map(({ name, href, Icon }) => (
            <button
              key={href}
              type="button"
              onClick={() => go(href)}
              aria-label={name}
              title={name}
              className="hover:bg-accent flex size-10 items-center justify-center rounded-full transition-colors"
            >
              <Icon className="size-[18px]" aria-hidden />
            </button>
          ))}

          <span className="bg-border mx-1 h-6 w-px" aria-hidden />

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hover:bg-accent flex h-10 items-center gap-2 rounded-full px-3 transition-colors"
            data-testid="commandBarSearch"
          >
            <Search className="size-[18px]" aria-hidden />
            <span className="text-muted-foreground text-sm">Search</span>
            {/* Hidden on touch, where there is no key to press. */}
            <kbd className="bg-muted text-muted-foreground hidden rounded px-1.5 py-0.5 font-mono text-[10px] sm:inline">
              ⌘K
            </kbd>
          </button>

          <ThemeToggle />
        </nav>
      </div>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Jump to a page, story or project"
      >
        <CommandInput placeholder="Search stories, projects and pages…" />
        <CommandList>
          <CommandEmpty>
            {results === null ? 'Loading…' : 'Nothing matches that.'}
          </CommandEmpty>

          <CommandGroup heading="Go to">
            {destinations.map(({ name, href, Icon }) => (
              <CommandItem key={href} value={name} onSelect={() => go(href)}>
                <Icon className="size-4" aria-hidden />
                {name}
              </CommandItem>
            ))}
            <CommandItem
              value="Contact"
              onSelect={() => go(`mailto:${CompanyInformation.email}`)}
            >
              <Mail className="size-4" aria-hidden />
              Contact us
            </CommandItem>
          </CommandGroup>

          {stories.length > 0 && (
            <CommandGroup heading="Stories">
              {stories.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.title} ${result.excerpt ?? ''}`}
                  onSelect={() => go(result.href)}
                >
                  <BookOpen className="size-4 shrink-0" aria-hidden />
                  <span className="truncate">{result.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {projects.length > 0 && (
            <CommandGroup heading="Projects">
              {projects.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.title} ${result.excerpt ?? ''}`}
                  onSelect={() => go(result.href)}
                >
                  <Briefcase className="size-4 shrink-0" aria-hidden />
                  <span className="truncate">{result.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {failed && (
            <p className="text-muted-foreground p-3 text-xs">
              Content search is unavailable right now.
            </p>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
