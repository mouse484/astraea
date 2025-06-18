import { Schema } from 'effect'
import { kinds } from 'nostr-tools'
import { NostrEventSchema, UserMetadataSchema } from '../nips/01'
import { MetadataWithKind05Schema } from '../nips/05'
import { MetadataExtraFieldsSchema } from '../nips/24'
import { createQuery } from '../query-helpers'

const MetadataSchema = Schema.partial(
  Schema.Struct({
    ...UserMetadataSchema.fields,
    ...MetadataWithKind05Schema.fields,
    ...MetadataExtraFieldsSchema.fields,
  }),
)

const MetadataEventSchema = Schema.Struct({
  ...NostrEventSchema.fields,
  kind: Schema.Literal(kinds.Metadata),
  content: Schema.parseJson(MetadataSchema),
})

export type MetadataEvent = typeof MetadataEventSchema.Type

export const metadataQuery = createQuery({
  name: 'metadata',
  schema: MetadataEventSchema,
  kind: kinds.Metadata,
})
