import { describe, expect, it } from 'vitest'
import { projectChips, projectLinks, storyTypeBadge } from './content-display'

describe('storyTypeBadge', () => {
  it('names the type for a non-problem story', () => {
    expect(storyTypeBadge({ type: 'article', problemStatus: null })).toBe('Article')
    expect(storyTypeBadge({ type: 'snippet', problemStatus: null })).toBe('Snippet')
  })

  it('appends the state for a problem', () => {
    expect(storyTypeBadge({ type: 'problem', problemStatus: 'open' })).toBe(
      'Problem · Open'
    )
    expect(storyTypeBadge({ type: 'problem', problemStatus: 'resolved' })).toBe(
      'Problem · Resolved'
    )
  })

  it('falls back to the plain label for a problem with no state', () => {
    expect(storyTypeBadge({ type: 'problem', problemStatus: null })).toBe('Problem')
  })

  // A problemStatus on a non-problem story is meaningless and must not leak in.
  it('ignores a stray state on a non-problem story', () => {
    expect(storyTypeBadge({ type: 'article', problemStatus: 'open' })).toBe('Article')
  })
})

describe('projectChips', () => {
  it('prefers technologies', () => {
    expect(
      projectChips({ technologies: ['Angular'], tags: ['SEO'] })
    ).toEqual(['Angular'])
  })

  // The migration left technologies empty with the stack still in tags.
  it('falls back to tags when technologies is empty', () => {
    expect(projectChips({ technologies: [], tags: ['Angular', 'Firebase'] })).toEqual([
      'Angular',
      'Firebase',
    ])
  })

  it('is empty when neither is set', () => {
    expect(projectChips({ technologies: [], tags: [] })).toEqual([])
  })
})

describe('projectLinks', () => {
  it('keeps only the links that are set, in a fixed order', () => {
    const links = projectLinks({
      sourceCodeLink: 'https://github.com/x/y',
      livePreviewLink: null,
      figmaLink: 'https://figma.com/f',
    })

    expect(links.map((link) => link.label)).toEqual(['Source code', 'Figma'])
    expect(links[0]?.href).toBe('https://github.com/x/y')
  })

  it('is empty when a project has no links', () => {
    expect(
      projectLinks({
        sourceCodeLink: null,
        livePreviewLink: null,
        figmaLink: null,
      })
    ).toEqual([])
  })
})
