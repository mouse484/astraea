import { Schema } from 'effect'

export const Lud12CommentAllowedSchema = Schema.Struct({
  commentAllowed: Schema.optional(Schema.Number),
})
