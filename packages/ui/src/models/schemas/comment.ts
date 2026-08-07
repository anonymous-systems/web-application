import { z } from 'zod'

export const COMMENT_CONTENT_MAX = 1000

/**
 * Input for leaving a comment, shared by the form and the write path so both
 * enforce one rule. The author reference and timestamp are owned by the writer,
 * not user input — the security rules require the stored `user` to match the
 * caller's uid, so accepting it here would be meaningless as well as unsafe.
 */
export const commentInputSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Write something first.')
    .max(
      COMMENT_CONTENT_MAX,
      `Comments must be ${COMMENT_CONTENT_MAX} characters or fewer.`
    ),
})

export type CommentInput = z.infer<typeof commentInputSchema>
