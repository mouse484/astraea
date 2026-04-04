import * as z from 'zod'
import {
  Hex32BytesSchema,
  Hex64BytesSchema,
  ImageURISchema,
  KindIntegerSchema,
  PubkeySchema,
  RelayUrlSchema,
} from '../schemas/common'
import { tupleWithOptional } from '../schemas/utilities'

export const TagSchema = z.union([
  tupleWithOptional(
    [
      z.literal('e'),
      PubkeySchema,
    ],
    RelayUrlSchema,
    PubkeySchema,
  ),
  tupleWithOptional(
    [
      z.literal('p'),
      PubkeySchema,
    ],
    RelayUrlSchema,
  ),
  z.union([
    tupleWithOptional(
      [
        z.literal('a'),
        z.string().trim().regex(/^\d+:[0-9a-f]{64}:.+$/i), // kind:pubkey:d format
      ],
      RelayUrlSchema,
    ),
  ]),
  z.tuple([
    z.literal('alt'),
    z.string().trim(),
  ]),
  z.array(z.string().trim()).min(1),
])

const TagsSchema = z.array(TagSchema)

export const NostrEventSchema = z.object({
  id: Hex32BytesSchema,
  pubkey: PubkeySchema,
  created_at: z.int().nonnegative(),
  kind: KindIntegerSchema,
  tags: TagsSchema,
  content: z.string().trim(),
  sig: Hex64BytesSchema,
})

export type NostrEvent = z.infer<typeof NostrEventSchema>

export const UserMetadataSchema = z.object({
  name: z.string().trim(),
  about: z.string().trim(),
  picture: ImageURISchema,
})
