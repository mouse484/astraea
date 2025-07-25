import { Schema } from 'effect'

export const LnurlPayResponseSchema = Schema.Struct({
  callback: Schema.String,
  maxSendable: Schema.Number,
  minSendable: Schema.Number,
  metadata: Schema.String,
  tag: Schema.String,
})
