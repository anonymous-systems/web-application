import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Comment } from '@workspace/ui/models/interfaces/comment'
import { CommentReactions } from './comment-reactions'

// The component only needs a signed-in uid to build the reaction path; nothing
// here writes, so the SDK is stubbed rather than pointed at an emulator.
vi.mock('@/hooks/use-auth', () => ({
  useAuth: (): { user: { uid: string }; signIn: () => void } => ({
    user: { uid: 'viewer' },
    signIn: vi.fn(),
  }),
}))
vi.mock('@workspace/firebase-config/client', () => ({
  getFirebaseFirestore: (): object => ({}),
}))
vi.mock('firebase/firestore', () => ({
  doc: (): object => ({}),
  setDoc: vi.fn(),
  deleteDoc: vi.fn(),
}))

const comment = (overrides: Partial<Comment> = {}): Comment =>
  ({
    id: 'c1',
    content: 'A comment',
    authorUid: 'someone',
    authorName: 'Someone',
    authorAvatar: null,
    createdAt: null,
    likeCount: 0,
    dislikeCount: 0,
    viewerReaction: null,
    viewerReported: false,
    ...overrides,
  }) as Comment

const dislikeButton = (): HTMLElement =>
  screen.getByRole('button', { name: 'Dislike' })

describe('CommentReactions', () => {
  /*
   * The reported bug. Counts are denormalised by a trigger that runs after the
   * reaction is written, so a re-render landing in between carries the viewer's
   * new `viewerReaction` while `dislikeCount` still excludes it. The component
   * used to measure its optimistic offset against those incoming props, which
   * cancelled the offset out and dropped the count back to zero until reload.
   */
  it('keeps the count when props arrive with the reaction but not the tally', () => {
    const props = { parentType: 'story' as const, parentId: 'p1' }
    const { rerender } = render(
      <CommentReactions comment={comment()} {...props} />
    )

    fireEvent.click(dislikeButton())
    expect(dislikeButton().textContent).toBe('1')

    // The half-updated document a refresh returns mid-flight.
    rerender(
      <CommentReactions
        comment={comment({ viewerReaction: 'dislike', dislikeCount: 0 })}
        {...props}
      />
    )

    expect(dislikeButton().textContent).toBe('1')
  })

  it('shows the server tally before the viewer reacts', () => {
    render(
      <CommentReactions
        comment={comment({ likeCount: 4, dislikeCount: 2 })}
        parentType="story"
        parentId="p1"
      />
    )

    expect(screen.getByRole('button', { name: 'Like' }).textContent).toBe('4')
    expect(dislikeButton().textContent).toBe('2')
  })
})
