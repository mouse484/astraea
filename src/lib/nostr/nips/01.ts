import { z } from 'zod'
import {
  Hex32BytesSchema,
  Hex64BytesSchema,
  ImageURISchema,
  KindIntegerSchema,
  PubkeySchema,
  RelayUrlSchema,
} from '../schemas/common'

export const TagSchema = z.union([
  z.tuple([
    z.literal('e'),
    PubkeySchema,
    RelayUrlSchema.optional(),
    PubkeySchema.optional(),
  ]),
  z.tuple([
    z.literal('p'),
    PubkeySchema,
    RelayUrlSchema.optional(),
  ]),
  z.tuple([
    z.literal('a'),
    z.string().regex(/^\d+:[0-9a-f]{64}:.+$/i).optional(), // kind:pubkey:d format
    RelayUrlSchema.optional(),
  ]),
  z.tuple([
    z.literal('alt'),
    z.string(),
  ]),
  z.array(z.string()).min(1),
])

const TagsSchema = z.array(TagSchema)

export const NostrEventSchema = z.object({
  id: Hex32BytesSchema,
  pubkey: PubkeySchema,
  created_at: z.number().int().nonnegative(),
  kind: KindIntegerSchema,
  tags: TagsSchema,
  content: z.string(),
  sig: Hex64BytesSchema,
})

export const UserMetadataSchema = z.object({
  name: z.string(),
  about: z.string(),
  picture: ImageURISchema,
})
