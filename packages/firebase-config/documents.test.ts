import { describe, expect, it } from 'vitest'
import { Timestamp } from 'firebase-admin/firestore'
import { toComment, toIsoString, toProject, toStory } from './documents'
import type { UserProfileDoc } from '@workspace/ui/models/interfaces/user-profile'
import type { TaxonomyTermRef } from '@workspace/ui/models/interfaces/taxonomy-term-ref'

// The mappers take plain values, so a reference only needs its id.
const userRef = (uid: string): { id: string } => ({ id: uid })

const FIREBASE: TaxonomyTermRef = { id: 'tagFirebase', name: 'Firebase', slug: 'firebase' }
const ANGULAR: TaxonomyTermRef = { id: 'techAngular', name: 'Angular', slug: 'angular' }

// Keyed by id and slug, exactly as the read layers build it.
const terms = new Map<string, TaxonomyTermRef>([
  [FIREBASE.id, FIREBASE],
  [FIREBASE.slug, FIREBASE],
  [ANGULAR.id, ANGULAR],
  [ANGULAR.slug, ANGULAR],
])

const profiles = (
  uid: string,
  profile: UserProfileDoc
): Map<string, UserProfileDoc> => new Map([[uid, profile]])

describe('toIsoString', () => {
  it('converts an admin SDK Timestamp', () => {
    const value = Timestamp.fromDate(new Date('2023-09-01T00:00:00.000Z'))

    expect(toIsoString(value)).toBe('2023-09-01T00:00:00.000Z')
  })

  // The admin and client SDKs ship separate Timestamp classes, so this is a
  // structural check — an `instanceof` would silently null the other SDK's dates.
  it('converts any Timestamp-shaped value, whichever SDK produced it', () => {
    const clientLike = { toDate: () => new Date('2024-02-03T04:05:06.000Z') }

    expect(toIsoString(clientLike)).toBe('2024-02-03T04:05:06.000Z')
  })

  it('is null for anything that is not a Timestamp', () => {
    expect(toIsoString(undefined)).toBeNull()
    expect(toIsoString(null)).toBeNull()
    expect(toIsoString('2026-01-01')).toBeNull()
    expect(toIsoString({})).toBeNull()
  })
})

describe('toStory', () => {
  it('maps a fully populated document', () => {
    const story = toStory(
      's1',
      {
        title: 'Using Firebase',
        slug: 'using-firebase',
        type: 'problem',
        status: 'published',
        visibility: 'public',
        problemStatus: 'resolved',
        readTimeMinutes: 3,
        tags: [userRef(FIREBASE.id)],
        user: userRef('uid1'),
        createdAt: Timestamp.fromDate(new Date('2023-09-01T00:00:00.000Z')),
      },
      profiles('uid1', { firstName: 'Ada', lastName: 'Lovelace' }),
      terms
    )

    expect(story.title).toBe('Using Firebase')
    expect(story.type).toBe('problem')
    expect(story.problemStatus).toBe('resolved')
    expect(story.readTimeMinutes).toBe(3)
    expect(story.tags).toEqual([FIREBASE])
    expect(story.authorUid).toBe('uid1')
    expect(story.authorName).toBe('Ada Lovelace')
    expect(story.createdAt).toBe('2023-09-01T00:00:00.000Z')
  })

  // The collections still hold pre-migration documents, so absent fields must
  // fall back rather than throw or leak undefined across the server boundary.
  it('falls back for a document with no fields', () => {
    const story = toStory('s2', {}, new Map())

    expect(story).toMatchObject({
      id: 's2',
      title: '',
      slug: '',
      type: 'article',
      status: 'draft',
      visibility: 'public',
      tags: [],
      allowComments: true,
      featured: false,
      problemStatus: null,
      readTimeMinutes: null,
      authorUid: null,
      authorName: null,
      authorAvatar: null,
      createdAt: null,
      publishedAt: null,
    })
  })

  it('leaves the author null when the profile was deleted', () => {
    const story = toStory('s3', { user: userRef('gone') }, new Map())

    expect(story.authorUid).toBe('gone')
    expect(story.authorName).toBeNull()
  })
})

describe('toProject', () => {
  it('maps a fully populated document', () => {
    const project = toProject(
      'p1',
      {
        title: 'Google Tasks Clone',
        slug: 'google-tasks-clone',
        status: 'published',
        visibility: 'public',
        technologies: [userRef(ANGULAR.id)],
        sourceCodeLink: 'https://github.com/x/y',
        developmentStatus: 'complete',
        user: userRef('uid1'),
        publishedAt: Timestamp.fromDate(new Date('2024-01-02T00:00:00.000Z')),
      },
      profiles('uid1', { firstName: 'Ada' }),
      terms
    )

    expect(project.title).toBe('Google Tasks Clone')
    expect(project.technologies).toEqual([ANGULAR])
    expect(project.developmentStatus).toBe('complete')
    expect(project.authorName).toBe('Ada')
    expect(project.publishedAt).toBe('2024-01-02T00:00:00.000Z')
  })

  it('falls back for a document with no fields', () => {
    const project = toProject('p2', {}, new Map())

    expect(project).toMatchObject({
      id: 'p2',
      title: '',
      status: 'draft',
      visibility: 'public',
      tags: [],
      technologies: [],
      sourceCodeLink: null,
      livePreviewLink: null,
      figmaLink: null,
      developmentStatus: null,
      featured: false,
      allowComments: true,
    })
  })
})

describe('toComment reaction counts', () => {
  it('reads the stored totals', () => {
    const comment = toComment('c', { likeCount: 3, dislikeCount: 1 }, new Map())

    expect(comment.likeCount).toBe(3)
    expect(comment.dislikeCount).toBe(1)
  })

  it('defaults to zero when a comment predates reactions', () => {
    const comment = toComment('c', {}, new Map())

    expect(comment.likeCount).toBe(0)
    expect(comment.dislikeCount).toBe(0)
  })

  /*
   * Dev held likeCount -1 against a single dislike: the like was created while
   * the counter trigger was undeployed so was never incremented, and switching
   * it to a dislike applied the -1 regardless. A count cannot be negative, and
   * the row hides a non-positive one — so the wrong number rendered as no
   * number at all, which is what made it hard to see.
   */
  it('floors a count that drifted negative', () => {
    const comment = toComment('c', { likeCount: -1, dislikeCount: 1 }, new Map())

    expect(comment.likeCount).toBe(0)
    expect(comment.dislikeCount).toBe(1)
  })
})

// The mapper is what keeps the site rendering while a collection is part-way
// through the reference migration, so each stored shape needs covering.
describe('taxonomy links', () => {
  it('resolves a reference to its term', () => {
    expect(toStory('s', { tags: [userRef(FIREBASE.id)] }, new Map(), terms).tags).toEqual([
      FIREBASE,
    ])
  })

  // Pre-migration stories stored the slug.
  it('resolves a stored slug', () => {
    expect(toStory('s', { category: 'firebase' }, new Map(), terms).category).toEqual(
      FIREBASE
    )
  })

  // Pre-migration projects stored the display name instead.
  it('resolves a stored display name', () => {
    expect(
      toProject('p', { technologies: ['Angular'] }, new Map(), terms).technologies
    ).toEqual([ANGULAR])
  })

  // A term that no longer exists has no name to show, and a raw id in a chip row
  // is worse than an absent chip.
  it('drops a link nothing answers to', () => {
    const story = toStory('s', { category: 'ghost', tags: ['ghost'] }, new Map(), terms)

    expect(story.category).toBeNull()
    expect(story.tags).toEqual([])
  })
})
