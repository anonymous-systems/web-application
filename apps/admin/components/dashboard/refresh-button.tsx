'use client'

import { JSX, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCwIcon } from 'lucide-react'
import { Button } from '@workspace/ui/components/custom/button'

/**
 * A soft refresh, showing a spinner while the refresh is in flight.
 */
export const RefreshButton = (): JSX.Element => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleRefresh = (): void => {
    startTransition(() => router.refresh())
  }

  return (
    <Button
      variant="outline"
      size="sm"
      loading={isPending}
      onClick={handleRefresh}
      data-testid="refreshButton"
    >
      <RefreshCwIcon className={isPending ? 'animate-spin' : undefined} />
      Refresh
    </Button>
  )
}
