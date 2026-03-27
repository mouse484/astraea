import { kinds } from 'nostr-tools'
import { z } from 'zod'
import { NostrEventSchema } from '../nips/01'

export const ReactionEventSchema = NostrEventSchema.extend({
  kind: z.literal(kinds.Reaction),
})
