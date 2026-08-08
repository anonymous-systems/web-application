'use client'

import { JSX, useState } from 'react'
import { Flag } from 'lucide-react'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { getFirebaseFirestore } from '@workspace/firebase-config/client'
import { Button } from '@workspace/ui/components/custom/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { Textarea } from '@workspace/ui/components/textarea'
import {
  REPORT_REASON_LABELS,
  REPORT_REASONS,
  ReportReason,
} from '@workspace/ui/models/report-constants'
import {
  REPORT_DETAIL_MAX,
  reportInputSchema,
} from '@workspace/ui/models/schemas/report'
import { useAuth } from '@/hooks/use-auth'
import { COLLECTION_FOR, CommentParentType } from '@/lib/comment-parents'

interface Props {
  commentId: string
  parentType: CommentParentType
  parentId: string
  /** True when this viewer already reported the comment. */
  reported: boolean
}

/**
 * Report a comment. The report document is keyed by the reporter's uid, so a
 * second report from the same person overwrites the first rather than stacking —
 * one voice, one report, enforced by the path rather than by validation.
 */
export const CommentReportDialog = ({
  commentId,
  parentType,
  parentId,
  reported,
}: Props): JSX.Element => {
  const { user, signIn } = useAuth()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<ReportReason | null>(null)
  const [detail, setDetail] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(reported)

  // "Something else" carries no meaning on its own, so the detail becomes the
  // report. The schema enforces it; this drives the wording and the a11y hint.
  const detailRequired = reason === 'other'

  const submit = async (): Promise<void> => {
    if (!user || !reason) return

    const parsed = reportInputSchema.safeParse({
      reason,
      detail: detail.trim() || undefined,
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'That report is not valid.')
      return
    }

    setSaving(true)
    try {
      await setDoc(
        doc(
          getFirebaseFirestore(),
          COLLECTION_FOR[parentType],
          parentId,
          'comments',
          commentId,
          'reports',
          user.uid
        ),
        {
          reason: parsed.data.reason,
          detail: parsed.data.detail ?? '',
          status: 'open',
          createdAt: serverTimestamp(),
        }
      )

      setDone(true)
      setOpen(false)
    } catch (cause) {
      console.error('Failed to report comment', cause)
      setError('Your report could not be sent. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Comment options"
            className="px-2"
          >
            <span aria-hidden>⋯</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={done}
            onSelect={() => (user ? setOpen(true) : void signIn())}
          >
            <Flag className="size-4" aria-hidden />
            {done ? 'Reported' : 'Report'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report this comment</DialogTitle>
            <DialogDescription>
              Tell us what is wrong with it. Reports go to a moderator, not to
              the person who wrote it.
            </DialogDescription>
          </DialogHeader>

          <fieldset className="flex flex-col gap-2">
            <legend className="sr-only">Reason</legend>
            {REPORT_REASONS.map((value) => (
              <label key={value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="reason"
                  value={value}
                  checked={reason === value}
                  onChange={() => {
                    setReason(value)
                    setError(null)
                  }}
                />
                {REPORT_REASON_LABELS[value]}
              </label>
            ))}
          </fieldset>

          <Textarea
            value={detail}
            onChange={(event) => {
              setDetail(event.target.value)
              setError(null)
            }}
            placeholder={
              detailRequired
                ? 'Tell us what is wrong'
                : 'Anything else we should know? (optional)'
            }
            maxLength={REPORT_DETAIL_MAX}
            aria-label="Report details"
            aria-required={detailRequired}
            rows={3}
          />

          {error && <p className="text-destructive text-sm">{error}</p>}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            {/* Disabled only on a missing reason, which the radios make obvious.
                A missing detail explains itself through the validation message
                instead — a button that is dead for an unstated reason does not. */}
            <Button onClick={() => void submit()} loading={saving} disabled={!reason}>
              Send report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
