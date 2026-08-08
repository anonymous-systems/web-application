import { readFileSync } from 'node:fs'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'

const PROJECT_ID = 'anonymous-systems-rules-test'
const OWNER_UID = 'owner-uid'
const OTHER_UID = 'other-uid'

let testEnv: RulesTestEnvironment

/**
 * A story/project document in the shape the rules inspect. `roles` is what
 * `getRole()` reads; `user` is what the comment create rule compares against.
 */
const content = (
  overrides: Record<string, unknown> = {}
): Record<string, unknown> => ({
  title: 'A story',
  status: 'published',
  visibility: 'public',
  allowComments: true,
  roles: { [OWNER_UID]: 'owner' },
  ...overrides,
})

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  })
})

afterAll(async () => await testEnv?.cleanup())

beforeEach(async () => await testEnv.clearFirestore())

/** Writes fixtures with rules disabled, so setup can't be blocked by them. */
const seed = async (
  path: string,
  data: Record<string, unknown>
): Promise<void> => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), path), data)
  })
}

const anonymous = () => testEnv.unauthenticatedContext().firestore()
const signedInAs = (uid: string) => testEnv.authenticatedContext(uid).firestore()

describe.each([
  { label: 'stories', collection: 'stories' },
  { label: 'projects', collection: 'projects' },
])('$label read rules', ({ collection }) => {
  it('lets anyone read a published, public document', async () => {
    await seed(`${collection}/doc1`, content())

    await assertSucceeds(getDoc(doc(anonymous(), `${collection}/doc1`)))
  })

  // The regression this suite exists for: `publicStory()` checked visibility but
  // not status, and storyInputSchema defaults to public + draft — so every new
  // draft was world-readable.
  it('denies anonymous reads of a draft, even when visibility is public', async () => {
    await seed(`${collection}/doc1`, content({ status: 'draft' }))

    await assertFails(getDoc(doc(anonymous(), `${collection}/doc1`)))
  })

  it('denies anonymous reads of a private document', async () => {
    await seed(`${collection}/doc1`, content({ visibility: 'private' }))

    await assertFails(getDoc(doc(anonymous(), `${collection}/doc1`)))
  })

  it('still lets the owner read their own draft', async () => {
    await seed(`${collection}/doc1`, content({ status: 'draft' }))

    await assertSucceeds(getDoc(doc(signedInAs(OWNER_UID), `${collection}/doc1`)))
  })

  it('denies a signed-in non-owner reading a draft', async () => {
    await seed(`${collection}/doc1`, content({ status: 'draft' }))

    await assertFails(getDoc(doc(signedInAs(OTHER_UID), `${collection}/doc1`)))
  })
})

describe.each([
  { label: 'story', collection: 'stories' },
  { label: 'project', collection: 'projects' },
])('$label comment rules', ({ collection }) => {
  const commentPath = `${collection}/doc1/comments/c1`

  const comment = (uid: string): Record<string, unknown> => ({
    content: 'Nice write-up',
    user: doc(signedInAs(uid), `users/${uid}`),
    createdAt: new Date(),
  })

  it('lets anyone read comments on a published, public parent', async () => {
    await seed(`${collection}/doc1`, content())
    await seed(commentPath, { content: 'Nice write-up' })

    await assertSucceeds(getDoc(doc(anonymous(), commentPath)))
  })

  // The comment read rule calls publicStory()/publicProject(), so it inherits
  // whatever those assert about the parent.
  it('denies reading comments on a draft parent', async () => {
    await seed(`${collection}/doc1`, content({ status: 'draft' }))
    await seed(commentPath, { content: 'Nice write-up' })

    await assertFails(getDoc(doc(anonymous(), commentPath)))
  })

  // A parent written before `allowComments` existed has no such field. Reading
  // it directly raised an evaluation error — denying the whole rule rather than
  // returning false — so the app rendered a thread it could never load. The
  // rules default to true here to match the schema and mapper defaults.
  it('allows comments on a parent with no allowComments field', async () => {
    const { allowComments: _omitted, ...withoutFlag } = content()
    await seed(`${collection}/doc1`, withoutFlag)
    await seed(commentPath, { content: 'Nice write-up' })

    await assertSucceeds(getDoc(doc(anonymous(), commentPath)))
  })

  it('denies reading comments when the parent disabled them', async () => {
    await seed(`${collection}/doc1`, content({ allowComments: false }))
    await seed(commentPath, { content: 'Nice write-up' })

    await assertFails(getDoc(doc(anonymous(), commentPath)))
  })

  it('lets a signed-in user comment as themselves', async () => {
    await seed(`${collection}/doc1`, content())

    await assertSucceeds(
      setDoc(doc(signedInAs(OTHER_UID), commentPath), comment(OTHER_UID))
    )
  })

  it('denies commenting as someone else', async () => {
    await seed(`${collection}/doc1`, content())

    await assertFails(
      setDoc(doc(signedInAs(OTHER_UID), commentPath), comment(OWNER_UID))
    )
  })

  it('denies anonymous commenting', async () => {
    await seed(`${collection}/doc1`, content())

    await assertFails(
      setDoc(doc(anonymous(), commentPath), { content: 'drive-by' })
    )
  })

  describe('reactions', () => {
    const reactionPath = (uid: string): string =>
      `${collection}/doc1/comments/c1/reactions/${uid}`

    it('lets a signed-in user write their own reaction', async () => {
      await seed(`${collection}/doc1`, content())

      await assertSucceeds(
        setDoc(doc(signedInAs(OTHER_UID), reactionPath(OTHER_UID)), {
          type: 'like',
        })
      )
    })

    // The reaction id is the reactor's uid, so reacting twice or as someone
    // else is impossible by construction rather than by validation.
    it("denies writing another user's reaction", async () => {
      await seed(`${collection}/doc1`, content())

      await assertFails(
        setDoc(doc(signedInAs(OTHER_UID), reactionPath(OWNER_UID)), {
          type: 'like',
        })
      )
    })

    it('denies anonymous reactions', async () => {
      await seed(`${collection}/doc1`, content())

      await assertFails(
        setDoc(doc(anonymous(), reactionPath(OTHER_UID)), { type: 'like' })
      )
    })

    it('denies a reaction type outside the vocabulary', async () => {
      await seed(`${collection}/doc1`, content())

      await assertFails(
        setDoc(doc(signedInAs(OTHER_UID), reactionPath(OTHER_UID)), {
          type: 'shrug',
        })
      )
    })

    // Counts are maintained by a trigger; letting a client write them would let
    // anyone set any total.
    it('denies smuggling extra fields onto a reaction', async () => {
      await seed(`${collection}/doc1`, content())

      await assertFails(
        setDoc(doc(signedInAs(OTHER_UID), reactionPath(OTHER_UID)), {
          type: 'like',
          likeCount: 9001,
        })
      )
    })

    it('denies reacting when the parent disabled comments', async () => {
      await seed(`${collection}/doc1`, content({ allowComments: false }))

      await assertFails(
        setDoc(doc(signedInAs(OTHER_UID), reactionPath(OTHER_UID)), {
          type: 'like',
        })
      )
    })

    it('lets anyone read reactions on a public parent', async () => {
      await seed(`${collection}/doc1`, content())
      await seed(reactionPath(OWNER_UID), { type: 'like' })

      await assertSucceeds(getDoc(doc(anonymous(), reactionPath(OWNER_UID))))
    })
  })

  describe('reports', () => {
    const reportPath = (uid: string): string =>
      `${collection}/doc1/comments/c1/reports/${uid}`

    const report = (): Record<string, unknown> => ({
      reason: 'spam',
      detail: 'Selling something',
      status: 'open',
      createdAt: new Date(),
    })

    it('lets a signed-in user file their own report', async () => {
      await seed(`${collection}/doc1`, content())

      await assertSucceeds(
        setDoc(doc(signedInAs(OTHER_UID), reportPath(OTHER_UID)), report())
      )
    })

    // The report id is the reporter's uid, so one person cannot bury a comment
    // under repeat reports, and filing in someone else's name is impossible.
    it("denies filing a report in another user's name", async () => {
      await seed(`${collection}/doc1`, content())

      await assertFails(
        setDoc(doc(signedInAs(OTHER_UID), reportPath(OWNER_UID)), report())
      )
    })

    it('denies anonymous reports', async () => {
      await seed(`${collection}/doc1`, content())

      await assertFails(
        setDoc(doc(anonymous(), reportPath(OTHER_UID)), report())
      )
    })

    it('denies a reason outside the vocabulary', async () => {
      await seed(`${collection}/doc1`, content())

      await assertFails(
        setDoc(doc(signedInAs(OTHER_UID), reportPath(OTHER_UID)), {
          ...report(),
          reason: 'because',
        })
      )
    })

    // Only a moderator moves a report on; opening one pre-reviewed would let a
    // reporter hide it from the queue.
    it('denies opening a report in any state but open', async () => {
      await seed(`${collection}/doc1`, content())

      await assertFails(
        setDoc(doc(signedInAs(OTHER_UID), reportPath(OTHER_UID)), {
          ...report(),
          status: 'reviewed',
        })
      )
    })

    it('denies a non-admin reading someone else’s report', async () => {
      await seed(`${collection}/doc1`, content())
      await seed(reportPath(OWNER_UID), report())

      await assertFails(getDoc(doc(signedInAs(OTHER_UID), reportPath(OWNER_UID))))
      await assertFails(getDoc(doc(anonymous(), reportPath(OWNER_UID))))
    })

    // So the UI can show "Reported" without a moderator round trip.
    it('lets a reporter read their own report', async () => {
      await seed(`${collection}/doc1`, content())
      await seed(reportPath(OTHER_UID), report())

      await assertSucceeds(
        getDoc(doc(signedInAs(OTHER_UID), reportPath(OTHER_UID)))
      )
    })

    it('denies a non-admin marking a report reviewed', async () => {
      await seed(`${collection}/doc1`, content())
      await seed(reportPath(OTHER_UID), report())

      await assertFails(
        setDoc(doc(signedInAs(OTHER_UID), reportPath(OTHER_UID)), {
          ...report(),
          status: 'reviewed',
        })
      )
    })
  })

  it('denies commenting on a draft parent', async () => {
    await seed(`${collection}/doc1`, content({ status: 'draft' }))

    await assertFails(
      setDoc(doc(signedInAs(OTHER_UID), commentPath), comment(OTHER_UID))
    )
  })
})

/*
 * The username -> uid index behind public profile URLs. A profile page resolves
 * one username, so `get` is permitted and `list` is not — the difference
 * between answering a question and handing over a directory of every username
 * on the site.
 */
describe('usernames index', () => {
  it('lets anyone resolve a single username', async () => {
    await seed('usernames/ada', { userId: OWNER_UID })

    await assertSucceeds(getDoc(doc(anonymous(), 'usernames/ada')))
  })

  it('refuses to list the index', async () => {
    await seed('usernames/ada', { userId: OWNER_UID })

    await assertFails(getDocs(collection(anonymous(), 'usernames')))
  })

  // Reserving a username without the profile it points at would make the index
  // lie, so only the onboarding function writes here — through the Admin SDK.
  it('refuses client writes, signed in or not', async () => {
    await assertFails(
      setDoc(doc(anonymous(), 'usernames/ada'), { userId: OWNER_UID })
    )
    await assertFails(
      setDoc(doc(signedInAs(OWNER_UID), 'usernames/ada'), { userId: OWNER_UID })
    )
  })

  it('refuses to overwrite someone else’s username', async () => {
    await seed('usernames/ada', { userId: OTHER_UID })

    await assertFails(
      setDoc(doc(signedInAs(OWNER_UID), 'usernames/ada'), { userId: OWNER_UID })
    )
  })
})
