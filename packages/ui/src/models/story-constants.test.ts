import { describe, expect, it } from 'vitest'
import {
  PROBLEM_STATUS_LABELS,
  PROBLEM_STATUSES,
  STORY_TYPE_LABELS,
  STORY_TYPES,
} from './story-constants'

// The story card badge and the /stories filters read straight from these maps,
// so a type added to the vocabulary without a label would render as undefined.
describe('story label maps', () => {
  it('labels every story type', () => {
    STORY_TYPES.forEach((type) => expect(STORY_TYPE_LABELS[type]).toBeTruthy())
  })

  it('labels every problem status', () => {
    PROBLEM_STATUSES.forEach((status) =>
      expect(PROBLEM_STATUS_LABELS[status]).toBeTruthy()
    )
  })
})
