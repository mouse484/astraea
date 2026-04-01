import { kinds } from 'nostr-tools'
import { z } from 'zod'
import { NostrEventSchema } from '../nips/01'
import { FollowListTagSchema } from '../nips/02'
import { createQuery } from '../query-helpers'

export const FollowListEventSchema = NostrEventSchema.extend({
  kind: z.literal(kinds.Contacts),
  tags: FollowListTagSchema,
})

export type FollowListEvent = z.infer<typeof FollowListEventSchema>

export const [FollowListQuery, setFollowListQuery] = createQuery({
  name: 'followlist',
  kind: kinds.Contacts,
  schema: FollowListEventSchema,
  filterKey: 'authors',
})
