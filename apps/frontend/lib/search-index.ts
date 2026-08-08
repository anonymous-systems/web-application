import {
  getDocs,
  type DocumentData,
  type QuerySnapshot,
} from 'firebase/firestore'
import { getFirebaseFirestore } from '@workspace/firebase-config/client'
import { byNewest, publiclyVisible } from '@/lib/public-content'
import { AppRoutes } from '@/lib/app-routes'

export type SearchKind = 'story' | 'project'

export interface SearchResult {
  id: string
  title: string
  excerpt: string | null
  href: string
  kind: SearchKind
}

interface Indexed {
  title: string
  slug: string
  excerpt: string | null
  publishedAt: string | null
  createdAt: string | null
}

const toIso = (value: unknown): string | null =>
  typeof value === 'object' && value !== null && 'toDate' in value
    ? (value as { toDate: () => Date }).toDate().toISOString()
    : null

/**
 * Everything the command bar can jump to, read in the browser as the visitor.
 *
 * Reuses `publiclyVisible` rather than restating the filter: rules authorise but
 * do not trim, so a query that asks for more than the rules allow is rejected
 * outright — the constraint has to match exactly, and there should be one copy
 * of it.
 *
 * Only the fields a result row shows are kept. The palette is a jump list, so
 * pulling article bodies into memory to search them would cost far more than it
 * returns.
 */
export const loadSearchIndex = async (): Promise<SearchResult[]> => {
  const firestore = getFirebaseFirestore()

  const [stories, projects] = await Promise.all([
    getDocs(publiclyVisible(firestore, 'stories')),
    getDocs(publiclyVisible(firestore, 'projects')),
  ])

  const read = (
    snapshot: QuerySnapshot<DocumentData>,
    kind: SearchKind
  ): SearchResult[] =>
    snapshot.docs
      .map((document) => {
        const data = document.data()

        return {
          id: document.id,
          title: (data.title as string | undefined) ?? '',
          slug: (data.slug as string | undefined) ?? '',
          excerpt: (data.excerpt as string | undefined) ?? null,
          publishedAt: toIso(data.publishedAt),
          createdAt: toIso(data.createdAt),
        } satisfies Indexed & { id: string }
      })
      .sort(byNewest)
      .map(({ id, title, excerpt, slug }) => ({
        id,
        title,
        excerpt,
        kind,
        href:
          kind === 'story'
            ? AppRoutes.storyDetail(slug)
            : AppRoutes.portfolioDetail(slug),
      }))

  return [...read(stories, 'story'), ...read(projects, 'project')]
}
