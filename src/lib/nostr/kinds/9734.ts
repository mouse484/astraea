import { z } from 'zod'
import { NostrEventSchema } from '../nips/01'
import { Hex32BytesSchema, PubkeySchema, RelayUrlSchema } from '../schemas/common'

const NumberFromStringCodec = z.codec(
  z.string(),
  z.number(),
  {
    decode: s => Number.parseFloat(s),
    encode: n => n.toString(),
  },
)

export const ZapRequestTagSchema = z.union([
  z.tuple([z.literal('relays')]).rest(RelayUrlSchema),
  z.tuple([z.literal('amount'), NumberFromStringCodec]),
  z.tuple([z.literal('lnurl'), z.string()]),
  z.tuple([z.literal('p'), PubkeySchema]),
  z.tuple([z.literal('e'), Hex32BytesSchema]),
  z.tuple([z.literal('a'), z.string()]),
])

export const ZapRequestEventSchema = NostrEventSchema.extend({
  kind: z.literal(9734),
  tags: z.array(ZapRequestTagSchema),
})
