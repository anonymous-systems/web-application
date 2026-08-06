import { ExternalLink, Figma, Github, type LucideIcon } from 'lucide-react'
import type { Story } from '@workspace/ui/models/interfaces/story'
import type { Project } from '@workspace/ui/models/interfaces/project'
import {
  PROBLEM_STATUS_LABELS,
  STORY_TYPE_LABELS,
} from '@workspace/ui/models/story-constants'

/**
 * Derived display values shared by a content card and its detail page. Both
 * surfaces show the same badge, chips and links, so the rules live here rather
 * than in each — when they were duplicated, a change in one left the card and
 * its own detail page disagreeing about the same document.
 *
 * Layout stays in the components: StoryCard and ProjectCard remain deliberately
 * separate, they just no longer each own a private copy of these rules.
 */

export const storyTypeBadge = (
  story: Pick<Story, 'type' | 'problemStatus'>
): string =>
  story.type === 'problem' && story.problemStatus
    ? `${STORY_TYPE_LABELS.problem} · ${PROBLEM_STATUS_LABELS[story.problemStatus]}`
    : STORY_TYPE_LABELS[story.type]

/**
 * The chip row's contents. Migrated projects have an empty `technologies`, with
 * the stack still sitting in `tags`, so the fallback keeps the row meaningful
 * until those are split in admin.
 */
export const projectChips = (
  project: Pick<Project, 'technologies' | 'tags'>
): string[] =>
  project.technologies.length > 0 ? project.technologies : project.tags

export interface ProjectLink {
  href: string
  label: string
  Icon: LucideIcon
}

export const projectLinks = (
  project: Pick<Project, 'sourceCodeLink' | 'livePreviewLink' | 'figmaLink'>
): ProjectLink[] =>
  [
    { href: project.sourceCodeLink, label: 'Source code', Icon: Github },
    { href: project.livePreviewLink, label: 'Live preview', Icon: ExternalLink },
    { href: project.figmaLink, label: 'Figma', Icon: Figma },
  ].filter((link): link is ProjectLink => Boolean(link.href))
