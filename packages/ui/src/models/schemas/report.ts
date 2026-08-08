import { z } from 'zod'
import { REPORT_REASONS } from '../report-constants'

export const REPORT_DETAIL_MAX = 500

/**
 * Input for reporting a comment. The reporter, the target and the status are
 * owned by the writer: the rules key a report by the reporter's uid and the
 * comment's path, so accepting either from the client would be meaningless as
 * well as unsafe.
 */
export const reportInputSchema = z
  .object({
    reason: z.enum(REPORT_REASONS),
    detail: z
      .string()
      .trim()
      .max(
        REPORT_DETAIL_MAX,
        `Please keep details to ${REPORT_DETAIL_MAX} characters or fewer.`
      )
      .optional(),
  })
  // Every other reason names the problem on its own; "Something else" names
  // nothing, and a moderator cannot act on a report that does not say what is
  // wrong. Detail is optional elsewhere and required here.
  .refine((value) => value.reason !== 'other' || Boolean(value.detail), {
    message: 'Tell us what is wrong so a moderator can act on it.',
    path: ['detail'],
  })

export type ReportInput = z.infer<typeof reportInputSchema>
