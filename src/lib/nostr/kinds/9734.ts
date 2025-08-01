import { Schema } from 'effect'
import { NostrEventSchema } from '../nips/01'
import { Hex32BytesSchema, PubkeySchema, RelayUrlSchema } from '../schemas/common'

export const ZapRequestTagSchema = Schema.Union(
  Schema.Tuple(
    [Schema.Literal('relays')],
    RelayUrlSchema,
  ),
  Schema.Tuple(
    Schema.Literal('amount'),
    Schema.NumberFromString,
  ),
  Schema.Tuple(
    Schema.Literal('lnurl'),
    Schema.String,
  ),
  Schema.Tuple(
    Schema.Literal('p'),
    PubkeySchema,
  ),
  Schema.Tuple(
    Schema.Literal('e'),
    Hex32BytesSchema,
  ),
  Schema.Tuple(
    Schema.Literal('a'),
    Schema.String,
  ),
)

export const ZapRequestEventSchema = Schema.Struct({
  ...NostrEventSchema.fields,
  kind: Schema.Literal(9734),
  tags: Schema.Array(ZapRequestTagSchema),
})
