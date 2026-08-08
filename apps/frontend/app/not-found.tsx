import { JSX } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Briefcase } from 'lucide-react'
import { Layout } from '@/components/layout'
import { Button } from '@workspace/ui/components/custom/button'
import { AppRoutes } from '@/lib/app-routes'

export const metadata = {
  title: 'Page not found | Anonymous Systems',
}

/**
 * Shown for an unknown route, and for a story or project slug that does not
 * resolve. Offers the two content indexes rather than only a link home: someone
 * who followed a dead link to a story usually wants a different story, not the
 * front page.
 */
const NotFound = (): JSX.Element => (
  <Layout dataTestId="notFoundPage">
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 p-4 py-24 text-center">
      <p className="text-muted-foreground font-mono text-sm">404</p>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">
          We couldn’t find that page
        </h1>
        <p className="text-muted-foreground text-pretty">
          It may have been moved or renamed. These are still here.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href={AppRoutes.home}>
            <ArrowLeft className="size-4" aria-hidden />
            Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={AppRoutes.stories}>
            <BookOpen className="size-4" aria-hidden />
            Stories
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={AppRoutes.portfolio}>
            <Briefcase className="size-4" aria-hidden />
            Portfolio
          </Link>
        </Button>
      </div>
    </div>
  </Layout>
)

export default NotFound
