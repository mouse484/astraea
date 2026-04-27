import { kinds } from 'nostr-tools'
import * as z from 'zod'
import { NostrEventSchema } from '../nips/01'
import { CustomEmojiTagSchema } from '../nips/30'
import { createQuery } from '../query-helpers'
import { createTagSchema } from '../schemas/utilities'

export const ReactionEventSchema = NostrEventSchema.extend({
  kind: z.literal(kinds.Reaction),
  tags: createTagSchema(CustomEmojiTagSchema),
})

export type ReactionEvent = z.infer<typeof ReactionEventSchema>

export const [ReactionQuery, setReactionQuery] = createQuery({
  name: 'reaction',
  kind: kinds.Reaction,
  schema: ReactionEventSchema,
  filterKey: 'ids',
})
