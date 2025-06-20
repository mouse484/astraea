import { Schema } from 'effect'
import {
  Hex32BytesSchema,
  Hex64BytesSchema,
  ImageURISchema,
  KindIntegerSchema,
  PubkeySchema,
  RelayUrlSchema,
} from '../schemas/common'

export const TagSchema = Schema.Union(
  Schema.Tuple(
    Schema.Literal('e'),
    PubkeySchema,
    Schema.optionalElement(RelayUrlSchema),
    Schema.optionalElement(PubkeySchema),
  ),
  Schema.Tuple(
    Schema.Literal('p'),
    PubkeySchema,
    Schema.optionalElement(RelayUrlSchema),
  ),
  Schema.Tuple(
    Schema.Literal('a'),
    Schema.optionalElement(
      Schema.TemplateLiteralParser(
        KindIntegerSchema,
        ':',
        PubkeySchema,
        ':',
        Schema.String,
      ),
    ),
    Schema.optionalElement(RelayUrlSchema),
  ),
  Schema.Array(Schema.String).pipe(Schema.minItems(1)),
)

const TagsSchema = Schema.Array(TagSchema)

export const NostrEventSchema = Schema.Struct({
  id: Hex32BytesSchema,
  pubkey: PubkeySchema,
  created_at: Schema.Number,
  kind: KindIntegerSchema,
  tags: TagsSchema,
  content: Schema.String,
  sig: Hex64BytesSchema,
})

export const UserMetadataSchema = Schema.Struct({
  name: Schema.String,
  about: Schema.String,
  picture: ImageURISchema,
})
