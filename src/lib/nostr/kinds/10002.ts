import { kinds } from 'nostr-tools'
import { z } from 'zod'
import { NostrEventSchema } from '../nips/01'
import { RelayListSchema } from '../nips/65'
import { createQuery } from '../query-helpers'

export const RelayListEventSchema = NostrEventSchema.extend({
  kind: z.literal(kinds.RelayList),
  tags: RelayListSchema,
  content: z.literal(''),
})

export type RelayListEvent = z.infer<typeof RelayListEventSchema>

export const [RelayListQuery, setRelayListQuery] = createQuery({
  name: 'relaylist',
  kind: kinds.RelayList,
  schema: RelayListEventSchema,
  filterKey: 'authors',
})
