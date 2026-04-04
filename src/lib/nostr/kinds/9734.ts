import * as z from 'zod'
import { NostrEventSchema } from '../nips/01'
import { Hex32BytesSchema, PubkeySchema, RelayUrlSchema } from '../schemas/common'
import { stringToNumber } from '../schemas/utilities'

const ZapRequestTagSchema = z.union([
  z.tuple([z.literal('relays'), RelayUrlSchema]).rest(RelayUrlSchema),
  z.tuple([z.literal('amount'), stringToNumber]),
  z.tuple([z.literal('lnurl'), z.string().trim()]),
  z.tuple([z.literal('p'), PubkeySchema]),
  z.tuple([z.literal('e'), Hex32BytesSchema]),
  z.tuple([z.literal('a'), z.string().trim()]),
])

export const ZapRequestEventSchema = NostrEventSchema.extend({
  kind: z.literal(9734),
  tags: z.array(ZapRequestTagSchema),
})
