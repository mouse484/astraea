import { Schema } from 'effect'

export const LnurlPayResponseSchema = Schema.Struct({
  callback: Schema.String,
  maxSendable: Schema.Number,
  minSendable: Schema.Number,
  metadata: Schema.String,
  tag: Schema.String,
})

export const LnurlPayInvoiceResponseSchema = Schema.Struct({
  pr: Schema.String,
  routes: Schema.Array(Schema.Any),
})

export const LnurlPayInvoiceErrorResponseSchema = Schema.Struct({
  status: Schema.Literal('ERROR'),
  reason: Schema.String,
})
