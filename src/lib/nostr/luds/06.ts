import * as z from 'zod'
import { Lud12CommentAllowedSchema } from './12'

export const LnurlPayResponseSchema = z.object({
  callback: z.string().trim(),
  maxSendable: z.number(),
  minSendable: z.number(),
  metadata: z.string().trim(),
  tag: z.string().trim(),
}).extend(Lud12CommentAllowedSchema.shape)

export const LnurlPayInvoiceResponseSchema = z.union([
  z.object({
    pr: z.string().trim(),
    routes: z.array(z.unknown()),
  }),
  z.object({
    status: z.literal('ERROR'),
    reason: z.string().trim(),
  }),
])
