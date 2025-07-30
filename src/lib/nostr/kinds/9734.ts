import { Schema } from 'effect'
import { NostrEventSchema } from '../nips/01'
import { PubkeySchema } from '../schemas/common'

export const ZapRequestTagSchema = Schema.Union(
  Schema.Tuple(
    Schema.Literal('relays'),
    Schema.String,
    Schema.Array(Schema.String).pipe(Schema.minItems(0)), // relay複数
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
    PubkeySchema,
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
