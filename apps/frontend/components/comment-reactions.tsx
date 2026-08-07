'use client'

import { JSX, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { getFirebaseFirestore } from '@workspace/firebase-config/client'
import { Button } from '@workspace/ui/components/custom/button'
import { cn } from '@workspace/ui/lib/utils'
import { ReactionType } from '@workspace/ui/models/comment-constants'
import { Comment } from '@workspace/ui/models/interfaces/comment'
import { useAuth } from '@/hooks/use-auth'
import { COLLECTION_FOR, CommentParentType } from '@/services/comment-service'

interface Props {
  comment: Comment
  parentType: CommentParentType
  parentId: string
}

/**
 * Thumb up/down on a comment. A reaction document is keyed by the reactor's uid,
 * so pressing the active side deletes it and pressing the other overwrites it —
 * reacting twice is impossible by construction rather than by validation.
 *
 * Counts come from the comment document, maintained by a trigger, and are
 * adjusted optimistically here so the number moves on click rather than after
 * the round trip.
 */
export const CommentReactions = ({
  comment,
  parentType,
  parentId,
}: Props): JSX.Element => {
  const router = useRouter()
  const { user, signIn } = useAuth()
  const [pending, setPending] = useState(false)
  const [reaction, setReaction] = useState(comment.viewerReaction)

  const offset = (type: ReactionType): number => {
    const had = comment.viewerReaction === type
    const has = reaction === type
    if (had === has) return 0
    return has ? 1 : -1
  }

  const likes = comment.likeCount + offset('like')
  const dislikes = comment.dislikeCount + offset('dislike')

  const react = async (type: ReactionType): Promise<void> => {
    if (!user) {
      void signIn()
      return
    }

    const next = reaction === type ? null : type
    setReaction(next)
    setPending(true)

    const path = doc(
      getFirebaseFirestore(),
      COLLECTION_FOR[parentType],
      parentId,
      'comments',
      comment.id,
      'reactions',
      user.uid
    )

    try {
      await (next ? setDoc(path, { type: next }) : deleteDoc(path))
      // The counter trigger writes the totals, so re-read once it has run.
      router.refresh()
    } catch (cause) {
      console.error('Failed to save reaction', cause)
      setReaction(comment.viewerReaction)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        aria-label="Like"
        aria-pressed={reaction === 'like'}
        disabled={pending}
        onClick={() => void react('like')}
        className={cn('px-2', reaction === 'like' && 'text-primary')}
      >
        <ThumbsUp className="size-4" aria-hidden />
        {likes > 0 && <span className="text-xs">{likes}</span>}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        aria-label="Dislike"
        aria-pressed={reaction === 'dislike'}
        disabled={pending}
        onClick={() => void react('dislike')}
        className={cn('px-2', reaction === 'dislike' && 'text-primary')}
      >
        <ThumbsDown className="size-4" aria-hidden />
        {dislikes > 0 && <span className="text-xs">{dislikes}</span>}
      </Button>
    </div>
  )
}
