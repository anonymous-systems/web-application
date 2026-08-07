import { readFileSync } from 'node:fs'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc } from 'firebase/firestore'
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

  it('denies commenting on a draft parent', async () => {
    await seed(`${collection}/doc1`, content({ status: 'draft' }))

    await assertFails(
      setDoc(doc(signedInAs(OTHER_UID), commentPath), comment(OTHER_UID))
    )
  })
})
