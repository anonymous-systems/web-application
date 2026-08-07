'use client'

import { JSX, useState, useTransition } from 'react'
import { CheckCheck } from 'lucide-react'
import { toast } from '@workspace/ui/components/sonner'
import { Button } from '@workspace/ui/components/custom/button'
import { CommentParentType } from '@/interfaces/comment'
import { dismissReports } from '@/app/(dashboard)/comments/actions'

interface Props {
  parentType: CommentParentType
  parentId: string
  commentId: string
}

/**
 * Clears a comment's open reports without deleting it — the "this is fine"
 * outcome. Kept separate from delete so a moderator can act on a report without
 * the only available response being removal.
 */
export const DismissReportsButton = ({
  parentType,
  parentId,
  commentId,
}: Props): JSX.Element => {
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)

  const dismiss = (): void => {
    startTransition(async () => {
      const result = await dismissReports(parentType, parentId, commentId)

      if (result.ok) {
        setDone(true)
        toast.success('Reports dismissed.')
      } else {
        toast.error(result.error ?? 'Could not dismiss the reports.')
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Dismiss reports"
      title="Dismiss reports"
      loading={pending}
      disabled={done}
      onClick={dismiss}
    >
      <CheckCheck />
    </Button>
  )
}
