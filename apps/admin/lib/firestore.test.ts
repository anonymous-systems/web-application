// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { DocumentSnapshot } from 'firebase-admin/firestore'
import { toIsoString, toProfileMap } from './firestore'

const snap = (
  id: string,
  data: Record<string, unknown> | null
): DocumentSnapshot =>
  ({ id, exists: data !== null, data: () => data ?? undefined }) as DocumentSnapshot

describe('toIsoString', () => {
  it('is null for anything that is not a Timestamp', () => {
    expect(toIsoString(undefined)).toBeNull()
    expect(toIsoString('2026-01-01')).toBeNull()
  })
})

describe('toProfileMap', () => {
  it('keys profiles by uid', () => {
    const profiles = toProfileMap([
      snap('uid1', { username: 'aaron' }),
      snap('uid2', { username: 'sam' }),
    ])

    expect(profiles.get('uid1')?.username).toBe('aaron')
    expect(profiles.get('uid2')?.username).toBe('sam')
  })

  // getAll returns a placeholder for a missing document, e.g. an author whose
  // profile was deleted — callers fall back to a null display name.
  it('skips snapshots that do not exist', () => {
    const profiles = toProfileMap([
      snap('present', { username: 'aaron' }),
      snap('deleted', null),
    ])

    expect(profiles.size).toBe(1)
    expect(profiles.has('deleted')).toBe(false)
  })

  it('is empty for no snapshots', () => {
    expect(toProfileMap([]).size).toBe(0)
  })
})
