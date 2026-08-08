'use client'

import { JSX, useState } from 'react'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { getFirebaseFirestore } from '@workspace/firebase-config/client'
import { Button } from '@workspace/ui/components/custom/button'
import { cn } from '@workspace/ui/lib/utils'
import { ReactionType } from '@workspace/ui/models/comment-constants'
import { Comment } from '@workspace/ui/models/interfaces/comment'
import { useAuth } from '@/hooks/use-auth'
import { COLLECTION_FOR, CommentParentType } from '@/lib/comment-parents'
import { displayedReactions } from '@/lib/reaction-display'

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
  const { user, signIn } = useAuth()
  const [pending, setPending] = useState(false)
  const [reaction, setReaction] = useState(comment.viewerReaction)

  // What the server said before this viewer touched anything, held for the life
  // of the component. The counts are denormalised by a trigger that runs after
  // the write, so re-reading the comment mid-flight yields the new reaction
  // against counts that have not caught up — see lib/reaction-display.ts.
  const [snapshot] = useState({
    reaction: comment.viewerReaction,
    likeCount: comment.likeCount,
    dislikeCount: comment.dislikeCount,
  })

  const { likes, dislikes } = displayedReactions(snapshot, reaction)

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
      // Deliberately no `router.refresh()`. The totals are written by a trigger
      // that has not run yet at this point, so refreshing here re-read a comment
      // that was half updated and made the count snap back to its old value. The
      // display is already correct from the snapshot; the server totals arrive
      // on the next load.
    } catch (cause) {
      console.error('Failed to save reaction', cause)
      setReaction(snapshot.reaction)
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
