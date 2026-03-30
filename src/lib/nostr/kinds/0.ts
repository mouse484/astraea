// import { Schema } from 'effect'
import { kinds } from 'nostr-tools'
import z from 'zod'
import { NostrEventSchema, UserMetadataSchema } from '../nips/01'
import { MetadataWithKind05Schema } from '../nips/05'
import { MetadataExtraFieldsSchema } from '../nips/24'
import { LightningMetadataSchema } from '../nips/57'
import { createQuery } from '../query-helpers'
import { jsonCodec } from '../schemas/utilities'

const MetadataSchema = z.object({
  ...UserMetadataSchema.shape,
  ...MetadataWithKind05Schema.shape,
  ...MetadataExtraFieldsSchema.shape,
  ...LightningMetadataSchema.shape,
}).partial()

export const MetadataEventSchema = NostrEventSchema.extend({
  kind: z.literal(kinds.Metadata),
  content: jsonCodec(MetadataSchema),
})

export type MetadataEvent = z.infer<typeof MetadataEventSchema>

export const [MetadataQuery, setMetadataQuery] = createQuery({
  name: 'metadata',
  kind: kinds.Metadata,
  schema: MetadataEventSchema,
  filterKey: 'authors',
})
