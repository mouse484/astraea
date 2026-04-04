import * as z from 'zod'
import { PubkeySchema, RelayUrlSchema } from '../schemas/common'
import { tupleWithOptional } from '../schemas/utilities'

export const FollowListTagSchema = z.codec(
  z.array(
    z.union([
      tupleWithOptional(
        [
          z.literal('p'),
          PubkeySchema,
        ],
        RelayUrlSchema,
        z.string().trim(),
      ),
      z.array(z.string().trim()),
    ]),
  ),
  z.array(PubkeySchema),
  {
    decode: (tags) => {
      return tags
        .filter(tag => Array.isArray(tag) && tag[0] === 'p')
        .map(tag => tag[1]!)
    },
    encode: (pubkeys) => {
      return pubkeys.map(pubkey => ['p', pubkey])
    },
  },
)
