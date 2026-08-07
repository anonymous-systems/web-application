import { beforeEach, describe, expect, it, vi } from 'vitest'

interface FakeRef {
  path: string
}
interface FakeSnapshot {
  data: () => Record<string, unknown>
  exists: () => boolean
}

const getDoc = vi.fn<(ref: FakeRef) => Promise<FakeSnapshot>>()
const getDocs = vi.fn<() => Promise<{ docs: FakeSnapshot[] }>>()

// The server helper mints an App Check token and builds a real Firebase app, so
// it is replaced with a pass-through; these tests are about how the service
// handles the reads, not how it obtains a Firestore.
vi.mock('@workspace/firebase-config/server-firestore', () => ({
  withServerFirestore: <T,>(read: (firestore: unknown) => Promise<T>): Promise<T> =>
    read({}),
}))

vi.mock('firebase/firestore', () => ({
  collection: (_firestore: unknown, path: string): FakeRef => ({ path }),
  query: (ref: FakeRef): FakeRef => ref,
  doc: (_firestore: unknown, ...segments: string[]): FakeRef => ({
    path: segments.join('/'),
  }),
  getDoc: (ref: FakeRef): Promise<FakeSnapshot> => getDoc(ref),
  getDocs: (): Promise<{ docs: FakeSnapshot[] }> => getDocs(),
}))

const { listComments } = await import('./comment-service')

const commentSnapshot = {
  docs: [
    { id: 'c1', data: (): Record<string, unknown> => ({ content: 'Nice write-up' }) },
  ],
} as unknown as { docs: FakeSnapshot[] }

const viewer = { uid: 'uid1', idToken: 'token' }

beforeEach(() => {
  vi.clearAllMocks()
  getDocs.mockResolvedValue(commentSnapshot)
})

describe('listComments', () => {
  it('resolves the viewer’s reaction and report', async () => {
    const snapshot = (fields: Record<string, unknown>): FakeSnapshot => ({
      data: (): Record<string, unknown> => fields,
      exists: (): boolean => true,
    })

    getDoc.mockImplementation((ref: FakeRef) =>
      Promise.resolve(
        ref.path.includes('reactions') ? snapshot({ type: 'like' }) : snapshot({})
      )
    )

    const [comment] = await listComments('story', 's1', viewer)

    expect(comment?.viewerReaction).toBe('like')
    expect(comment?.viewerReported).toBe(true)
  })

  // permission-denied is what undeployed rules actually returned here, and it
  // 500d the article in production.
  it('still returns the thread when the viewer reads are denied', async () => {
    getDoc.mockRejectedValue(
      Object.assign(new Error('Missing or insufficient permissions.'), {
        code: 'permission-denied',
      })
    )

    const comments = await listComments('story', 's1', viewer)

    expect(comments).toHaveLength(1)
    expect(comments[0]?.content).toBe('Nice write-up')
    expect(comments[0]?.viewerReaction).toBeNull()
    expect(comments[0]?.viewerReported).toBe(false)
  })

  it('skips the viewer reads entirely when signed out', async () => {
    const comments = await listComments('story', 's1')

    expect(comments).toHaveLength(1)
    expect(getDoc).not.toHaveBeenCalled()
  })
})
