import { Schema } from 'effect'
import { Lud12CommentAllowedSchema } from './12'

export const LnurlPayResponseSchema = Schema.Struct({
  callback: Schema.String,
  maxSendable: Schema.Number,
  minSendable: Schema.Number,
  metadata: Schema.String,
  tag: Schema.String,
  ...Lud12CommentAllowedSchema.fields,
})

export const LnurlPayInvoiceResponseSchema = Schema.Struct({
  pr: Schema.String,
  routes: Schema.Array(Schema.Any),
})

export const LnurlPayInvoiceErrorResponseSchema = Schema.Struct({
  status: Schema.Literal('ERROR'),
  reason: Schema.String,
})
