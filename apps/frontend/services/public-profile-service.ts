import { doc, getDoc, getDocs, query, where, type Firestore } from 'firebase/firestore'
import { withServerFirestore } from '@workspace/firebase-config/server-firestore'
import { toProject, toStory } from '@workspace/firebase-config/documents'
import { resolveAuthorName } from '@workspace/ui/lib/user-display'
import type { UserProfileDoc } from '@workspace/ui/models/interfaces/user-profile'
import type { Story } from '@workspace/ui/models/interfaces/story'
import type { Project } from '@workspace/ui/models/interfaces/project'
import { byNewest, publiclyVisible } from '@/lib/public-content'
import { loadTerms } from '@/lib/terms'

export interface PublicProfile {
  uid: string
  username: string
  name: string | null
  avatar: string | null
  stories: Story[]
  projects: Project[]
}

/**
 * The uid behind a username, or null.
 *
 * Read as a single document from the `usernames` index the onboarding function
 * maintains, rather than by querying `users` for a matching field. The rules
 * grant `get` here and not `list`, so this can answer one username without the
 * collection becoming a directory of all of them — and it leaves `users` free
 * to be narrowed later, which a query against it would not.
 */
const uidForUsername = async (
  firestore: Firestore,
  username: string
): Promise<string | null> => {
  const snapshot = await getDoc(doc(firestore, 'usernames', username))
  const userId: unknown = snapshot.data()?.userId

  return typeof userId === 'string' ? userId : null
}

/** Published, public content by one author, newest first. */
const authoredBy = async <T>(
  firestore: Firestore,
  path: 'stories' | 'projects',
  uid: string,
  map: (id: string, data: Record<string, unknown>) => T
): Promise<T[]> => {
  // Narrowing `publiclyVisible` rather than replacing it: rules authorise but do
  // not filter, so the published/public predicate has to stay exactly as the
  // rules expect. Adding an author filter only asks for less.
  const snapshot = await getDocs(
    query(
      publiclyVisible(firestore, path),
      where('user', '==', doc(firestore, 'users', uid))
    )
  )

  return snapshot.docs.map((document) => map(document.id, document.data()))
}

/**
 * A public profile: who the author is, and what they have published.
 *
 * Returns null when the username resolves to nothing, so the page can answer
 * 404 rather than render an empty profile for someone who does not exist.
 *
 * Read anonymously — every document involved is world-readable, and a profile
 * is public by definition.
 */
export const getPublicProfile = async (
  username: string
): Promise<PublicProfile | null> =>
  withServerFirestore(async (firestore) => {
    const uid = await uidForUsername(firestore, username)
    if (!uid) return null

    const profileSnapshot = await getDoc(doc(firestore, 'users', uid))
    if (!profileSnapshot.exists()) return null

    const profile = profileSnapshot.data() as UserProfileDoc
    const terms = await loadTerms(firestore)

    const [stories, projects] = await Promise.all([
      authoredBy(firestore, 'stories', uid, (id, data) =>
        toStory(id, data, new Map([[uid, profile]]), terms)
      ),
      authoredBy(firestore, 'projects', uid, (id, data) =>
        toProject(id, data, new Map([[uid, profile]]), terms)
      ),
    ])

    return {
      uid,
      username,
      name: resolveAuthorName(profile),
      avatar: profile.avatar ?? null,
      stories: stories.sort(byNewest),
      projects: projects.sort(byNewest),
    }
  })
