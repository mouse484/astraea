import { Schema } from 'effect'
import { NostrEventSchema } from '../nips/01'
import { PubkeySchema } from '../schemas/common'

export const ZapReceiptTagSchema = Schema.Union(
  Schema.Tuple(
    Schema.Literal('p'),
    PubkeySchema,
  ),
  Schema.Tuple(
    Schema.Literal('P'),
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
  Schema.Tuple(
    Schema.Literal('bolt11'),
    Schema.String,
  ),
  Schema.Tuple(
    Schema.Literal('description'),
    Schema.String,
  ),
  Schema.Tuple(
    Schema.Literal('preimage'),
    Schema.String,
  ),
)

export const ZapReceiptEventSchema = Schema.Struct({
  ...NostrEventSchema.fields,
  kind: Schema.Literal(9735),
  tags: Schema.Array(ZapReceiptTagSchema),
  content: Schema.Literal(''),
})
