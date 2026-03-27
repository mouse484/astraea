import { z } from 'zod'
import { Lud12CommentAllowedSchema } from './12'

export const LnurlPayResponseSchema = z.object({
  callback: z.string(),
  maxSendable: z.number(),
  minSendable: z.number(),
  metadata: z.string(),
  tag: z.string(),
}).extend(Lud12CommentAllowedSchema.shape)

export const LnurlPayInvoiceResponseSchema = z.union([
  z.object({
    pr: z.string(),
    routes: z.array(z.any()),
  }),
  z.object({
    status: z.literal('ERROR'),
    reason: z.string(),
  }),
])
