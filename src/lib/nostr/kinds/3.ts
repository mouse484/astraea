import { kinds } from 'nostr-tools'
import { z } from 'zod'
import { NostrEventSchema } from '../nips/01'
import { FollowListTagSchema } from '../nips/02'
import { createQuery } from '../query-helpers'

const FollowListEventSchema = NostrEventSchema.extend({
  kind: z.literal(kinds.Contacts),
  tags: FollowListTagSchema,
})

export const FollowListQuery = createQuery({
  name: 'followlist',
  schema: FollowListEventSchema,
  kind: kinds.Contacts,
  filterKey: 'authors',
})
