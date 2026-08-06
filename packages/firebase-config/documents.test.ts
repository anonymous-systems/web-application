import { describe, expect, it } from 'vitest'
import { Timestamp } from 'firebase-admin/firestore'
import type { DocumentReference, DocumentSnapshot } from 'firebase-admin/firestore'
import { toProject, toStory } from './documents'
import type { UserProfileDoc } from '@workspace/ui/models/interfaces/user-profile'

const snap = (id: string, data: Record<string, unknown>): DocumentSnapshot =>
  ({ id, exists: true, data: () => data }) as DocumentSnapshot

const userRef = (uid: string): DocumentReference =>
  ({ id: uid }) as DocumentReference

const profiles = (uid: string, profile: UserProfileDoc) =>
  new Map<string, UserProfileDoc>([[uid, profile]])

describe('toStory', () => {
  it('maps a fully populated document', () => {
    const story = toStory(
      snap('s1', {
        title: 'Using Firebase',
        slug: 'using-firebase',
        type: 'problem',
        status: 'published',
        visibility: 'public',
        problemStatus: 'resolved',
        readTimeMinutes: 3,
        tags: ['firebase'],
        user: userRef('uid1'),
        createdAt: Timestamp.fromDate(new Date('2023-09-01T00:00:00.000Z')),
      }),
      profiles('uid1', { firstName: 'Ada', lastName: 'Lovelace' })
    )

    expect(story.title).toBe('Using Firebase')
    expect(story.type).toBe('problem')
    expect(story.problemStatus).toBe('resolved')
    expect(story.readTimeMinutes).toBe(3)
    expect(story.authorUid).toBe('uid1')
    expect(story.authorName).toBe('Ada Lovelace')
    expect(story.createdAt).toBe('2023-09-01T00:00:00.000Z')
  })

  // The collections still hold pre-migration documents, so absent fields must
  // fall back rather than throw or leak undefined across the server boundary.
  it('falls back for a document with no fields', () => {
    const story = toStory(snap('s2', {}), new Map())

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
    const story = toStory(snap('s3', { user: userRef('gone') }), new Map())

    expect(story.authorUid).toBe('gone')
    expect(story.authorName).toBeNull()
  })
})

describe('toProject', () => {
  it('maps a fully populated document', () => {
    const project = toProject(
      snap('p1', {
        title: 'Google Tasks Clone',
        slug: 'google-tasks-clone',
        status: 'published',
        visibility: 'public',
        technologies: ['Angular'],
        sourceCodeLink: 'https://github.com/x/y',
        developmentStatus: 'complete',
        user: userRef('uid1'),
        publishedAt: Timestamp.fromDate(new Date('2024-01-02T00:00:00.000Z')),
      }),
      profiles('uid1', { firstName: 'Ada' })
    )

    expect(project.title).toBe('Google Tasks Clone')
    expect(project.technologies).toEqual(['Angular'])
    expect(project.developmentStatus).toBe('complete')
    expect(project.authorName).toBe('Ada')
    expect(project.publishedAt).toBe('2024-01-02T00:00:00.000Z')
  })

  it('falls back for a document with no fields', () => {
    const project = toProject(snap('p2', {}), new Map())

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
