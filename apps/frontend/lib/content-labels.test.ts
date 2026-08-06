import { describe, expect, it } from 'vitest'
import {
  PROBLEM_STATUS_LABELS,
  PROBLEM_STATUSES,
  STORY_TYPE_LABELS,
  STORY_TYPES,
} from '@workspace/ui/models/story-constants'
import {
  PROJECT_DEVELOPMENT_STATUS_LABELS,
  PROJECT_DEVELOPMENT_STATUSES,
} from '@workspace/ui/models/project-constants'
import { initialsFrom } from '@workspace/ui/lib/initials'

// The card badges and list filters read straight from these maps, so a value
// added to a vocabulary without a label would render as undefined.
describe('content label maps', () => {
  it('labels every story type', () => {
    STORY_TYPES.forEach((type) => expect(STORY_TYPE_LABELS[type]).toBeTruthy())
  })

  it('labels every problem status', () => {
    PROBLEM_STATUSES.forEach((status) =>
      expect(PROBLEM_STATUS_LABELS[status]).toBeTruthy()
    )
  })

  it('labels every project development status', () => {
    PROJECT_DEVELOPMENT_STATUSES.forEach((status) =>
      expect(PROJECT_DEVELOPMENT_STATUS_LABELS[status]).toBeTruthy()
    )
  })
})

describe('initialsFrom', () => {
  it('takes up to two initials from a display name', () => {
    expect(initialsFrom('Ada Lovelace')).toBe('AL')
    expect(initialsFrom('Ada Byron Lovelace')).toBe('AB')
  })

  it('is blank for an unknown author, so no stray letter renders', () => {
    expect(initialsFrom(null)).toBe('')
    expect(initialsFrom(undefined)).toBe('')
  })
})
