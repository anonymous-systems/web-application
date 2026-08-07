import { describe, expect, it } from 'vitest'
import { Timestamp } from 'firebase-admin/firestore'
import { toIsoString, toProject, toStory } from './documents'
import type { UserProfileDoc } from '@workspace/ui/models/interfaces/user-profile'

// The mappers take plain values, so a reference only needs its id.
const userRef = (uid: string): { id: string } => ({ id: uid })

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
        tags: ['firebase'],
        user: userRef('uid1'),
        createdAt: Timestamp.fromDate(new Date('2023-09-01T00:00:00.000Z')),
      },
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
        technologies: ['Angular'],
        sourceCodeLink: 'https://github.com/x/y',
        developmentStatus: 'complete',
        user: userRef('uid1'),
        publishedAt: Timestamp.fromDate(new Date('2024-01-02T00:00:00.000Z')),
      },
      profiles('uid1', { firstName: 'Ada' })
    )

    expect(project.title).toBe('Google Tasks Clone')
    expect(project.technologies).toEqual(['Angular'])
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
