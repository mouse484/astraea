import { z } from 'zod'

export const Lud12CommentAllowedSchema = z.object({
  commentAllowed: z.number().optional(),
})
