import { Schema } from 'effect'
import { kinds } from 'nostr-tools'
import { NostrEventSchema } from '../nips/01'

export const ReactionEventSchema = Schema.Struct({
  ...NostrEventSchema.fields,
  kind: Schema.Literal(kinds.Reaction),
})
