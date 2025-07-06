import { Schema } from 'effect'
import { kinds } from 'nostr-tools'
import { NostrEventSchema } from '../nips/01'
import { FollowListTagSchema } from '../nips/02'
import { createQuery } from '../query-helpers'

const FollowListEventSchema = Schema.Struct({
  ...NostrEventSchema.fields,
  kind: Schema.Literal(kinds.Contacts),
  tags: FollowListTagSchema,
})

export const FollowListQuery = createQuery({
  name: 'followlist',
  schema: FollowListEventSchema,
  kind: kinds.Contacts,
  filterKey: 'authors',
})
