import { z } from 'zod'
import { PubkeySchema, RelayUrlSchema } from '../schemas/common'

export const FollowListTagSchema = z.codec(
  z.array(
    z.union([
      z.tuple([
        z.literal('p'),
        PubkeySchema,
        RelayUrlSchema.optional(),
        z.string().optional(),
      ]),
      z.array(z.string()),
    ]),
  ),
  z.array(PubkeySchema),
  {
    decode: (tags) => {
      return tags
        .filter(tag => Array.isArray(tag) && tag[0] === 'p')
        .map(tag => tag[1])
    },
    encode: (pubkeys) => {
      return pubkeys.map(pubkey => ['p', pubkey])
    },
  },
)
