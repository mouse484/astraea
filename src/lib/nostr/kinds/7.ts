import { kinds } from 'nostr-tools'
import { z } from 'zod'
import { NostrEventSchema } from '../nips/01'
import { createQuery } from '../query-helpers'

export const ReactionEventSchema = NostrEventSchema.extend({
  kind: z.literal(kinds.Reaction),
})

export const [ReactionQuery, setReactionQuery] = createQuery({
  name: 'reaction',
  kind: kinds.Reaction,
  schema: ReactionEventSchema,
  filterKey: 'ids',
})
