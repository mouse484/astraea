import { z } from 'zod'
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
        z.string(),
      ),
      z.array(z.string()),
    ]),
  ),
  z.array(PubkeySchema),
  {
    decode: (tags) => {
      return tags
        .filter(tag => Array.isArray(tag) && tag[0] === 'p' && tag.length >= 2)
        .map(tag => tag[1]!)
    },
    encode: (pubkeys) => {
      return pubkeys.map(pubkey => ['p', pubkey])
    },
  },
)
