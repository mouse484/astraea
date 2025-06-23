import { Schema } from 'effect'
import { kinds } from 'nostr-tools'
import { NostrEventSchema } from '../nips/01'
import { RelayListSchema } from '../nips/65'
import { createQuery } from '../query-helpers'

export const RelayListEventSchema = Schema.Struct({
  ...NostrEventSchema.fields,
  kind: Schema.Literal(kinds.RelayList),
  tags: RelayListSchema,
  content: Schema.optional(Schema.Literal('')),
})

export const relayListQuery = createQuery({
  name: 'relaylist',
  schema: RelayListEventSchema,
  kind: kinds.RelayList,
  filterKey: 'authors',
})
