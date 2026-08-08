'use client'

import { JSX, useEffect } from 'react'
import Link from 'next/link'
import { RefreshCw } from 'lucide-react'
import { Layout } from '@/components/layout'
import { Button } from '@workspace/ui/components/custom/button'
import { AppRoutes } from '@/lib/app-routes'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * The last resort when a route throws.
 *
 * Shows the digest, because that is the only handle on a server error once it
 * reaches the browser: the message itself is stripped in production, so a reader
 * reporting "it broke" can otherwise give nothing to match against the logs.
 */
const Error = ({ error, reset }: Props): JSX.Element => {
  useEffect(() => {
    console.error('Unhandled route error', error)
  }, [error])

  return (
    <Layout dataTestId="errorPage">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 p-4 py-24 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">
            Something went wrong
          </h1>
          <p className="text-muted-foreground text-pretty">
            This one is on us. Trying again often works.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset}>
            <RefreshCw className="size-4" aria-hidden />
            Try again
          </Button>
          <Button variant="outline" asChild>
            <Link href={AppRoutes.home}>Go home</Link>
          </Button>
        </div>

        {error.digest && (
          <p className="text-muted-foreground font-mono text-xs">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </Layout>
  )
}

export default Error
