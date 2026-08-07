'use client'

import { JSX, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore'
import { getFirebaseFirestore } from '@workspace/firebase-config/client'
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import { Button } from '@workspace/ui/components/custom/button'
import { Textarea } from '@workspace/ui/components/textarea'
import { initialsFrom } from '@workspace/ui/lib/initials'
import {
  COMMENT_CONTENT_MAX,
  commentInputSchema,
} from '@workspace/ui/models/schemas/comment'
import { useAuth } from '@/hooks/use-auth'
import { CommentParentType } from '@/services/comment-service'

const COLLECTION_FOR: Record<CommentParentType, string> = {
  story: 'stories',
  project: 'projects',
}

interface Props {
  parentType: CommentParentType
  parentId: string
}

/**
 * Writes straight to Firestore with the client SDK as the signed-in user, which
 * is what the comment rules already assert — they require the stored `user` to
 * equal the caller's uid, and check the parent is published, public and has
 * comments enabled. Going through a server action instead would use the Admin
 * SDK, bypass all of that, and mean reimplementing those four checks by hand.
 */
export const CommentForm = ({ parentType, parentId }: Props): JSX.Element => {
  const router = useRouter()
  const { user, signIn } = useAuth()
  const [content, setContent] = useState('')
  const [focused, setFocused] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-muted-foreground text-sm">
          Sign in to join the conversation.
        </p>
        <Button size="sm" onClick={() => void signIn()}>
          Sign in
        </Button>
      </div>
    )
  }

  const reset = (): void => {
    setContent('')
    setFocused(false)
    setError(null)
  }

  const submit = async (): Promise<void> => {
    const parsed = commentInputSchema.safeParse({ content })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'That comment is not valid.')
      return
    }

    setSaving(true)
    try {
      const firestore = getFirebaseFirestore()
      await addDoc(
        collection(firestore, COLLECTION_FOR[parentType], parentId, 'comments'),
        {
          content: parsed.data.content,
          user: doc(firestore, 'users', user.uid),
          createdAt: serverTimestamp(),
        }
      )

      reset()
      router.refresh()
    } catch (cause) {
      console.error('Failed to add comment', cause)
      setError('Your comment could not be posted. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <Avatar className="size-8 shrink-0">
          {user.photoURL && <AvatarImage src={user.photoURL} alt="" />}
          <AvatarFallback className="text-xs">
            {initialsFrom(user.displayName)}
          </AvatarFallback>
        </Avatar>

        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Add a comment…"
          maxLength={COMMENT_CONTENT_MAX}
          rows={focused ? 3 : 1}
          aria-label="Add a comment"
          className="min-h-0 resize-none"
        />
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {/* The composer only offers actions once engaged, so an untouched thread
          shows a single line rather than a form. */}
      {focused && (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={reset} disabled={saving}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => void submit()}
            loading={saving}
            disabled={content.trim().length === 0}
          >
            Comment
          </Button>
        </div>
      )}
    </div>
  )
}
