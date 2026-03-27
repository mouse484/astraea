import { kinds } from 'nostr-tools'
import { z } from 'zod'
import { NostrEventSchema } from '../nips/01'
import { RelayListSchema } from '../nips/65'
import { createQuery } from '../query-helpers'

export const RelayListEventSchema = NostrEventSchema.extend({
  kind: z.literal(kinds.RelayList),
  tags: RelayListSchema,
  content: z.literal('').optional(),
})

export const relayListQuery = createQuery({
  name: 'relaylist',
  schema: RelayListEventSchema,
  kind: kinds.RelayList,
  filterKey: 'authors',
})
