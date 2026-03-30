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

export type RelayListEvent = z.infer<typeof RelayListEventSchema>

export const relayListQuery = createQuery<RelayListEvent> ({
  name: 'relaylist',
  kind: kinds.RelayList,
  filterKey: 'authors',
})
