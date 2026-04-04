import * as z from 'zod'
import { NostrEventSchema } from '../nips/01'
import { PubkeySchema } from '../schemas/common'

export const ZapReceiptTagSchema = z.union([
  z.tuple([z.literal('p'), PubkeySchema]),
  z.tuple([z.literal('P'), PubkeySchema]),
  z.tuple([z.literal('e'), PubkeySchema]),
  z.tuple([z.literal('a'), z.string().trim()]),
  z.tuple([z.literal('bolt11'), z.string().trim()]),
  z.tuple([z.literal('description'), z.string().trim()]),
  z.tuple([z.literal('preimage'), z.string().trim()]),
])

export const ZapReceiptEventSchema = NostrEventSchema.extend({
  kind: z.literal(9735),
  tags: z.array(ZapReceiptTagSchema),
  content: z.literal(''),
})
