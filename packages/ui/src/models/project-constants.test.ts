import { describe, expect, it } from 'vitest'
import {
  PROJECT_DEVELOPMENT_STATUS_LABELS,
  PROJECT_DEVELOPMENT_STATUSES,
} from './project-constants'

// The project card badge and the /portfolio filters read straight from this
// map, so a status added to the vocabulary without a label would render as
// undefined.
describe('project label map', () => {
  it('labels every development status', () => {
    PROJECT_DEVELOPMENT_STATUSES.forEach((status) =>
      expect(PROJECT_DEVELOPMENT_STATUS_LABELS[status]).toBeTruthy()
    )
  })
})
