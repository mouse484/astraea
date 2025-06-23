import { Schema } from 'effect'
import { PubkeySchema, RelayUrlSchema } from '../schemas/common'

export const FollowListTagSchema = Schema.transform(
  Schema.Array(
    Schema.Union(
      Schema.Tuple(
        Schema.Literal('p'),
        PubkeySchema,
        Schema.optionalElement(RelayUrlSchema),
        Schema.optionalElement(Schema.String).annotations({
          description: 'local name or petname',
        }),
      ),
      Schema.Array(Schema.String),
    ),
  ),
  Schema.Array(PubkeySchema),
  {
    strict: true,
    decode: (tags) => {
      return tags
        .filter(([tagName]) => tagName === 'p')
        .map(([_, pubkey]) => pubkey)
    },
    encode: (pubkeys) => {
      return pubkeys.map((pubkey) => {
        return ['p', pubkey] as const
      })
    },
  },
)
