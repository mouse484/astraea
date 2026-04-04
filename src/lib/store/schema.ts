import * as z from 'zod'

import { PubkeySchema, RelayUrlSchema } from '../nostr/schemas/common'

export type StoreKey = keyof typeof StoreSchemas
export type StoreValue<K extends StoreKey> = z.output<typeof StoreSchemas[K]>

export const StoreSchemas = {
  pubkey: PubkeySchema,
  relays: z.array(
    z.object({
      url: RelayUrlSchema,
      read: z.boolean(),
      write: z.boolean(),
    }),
  ),
}
