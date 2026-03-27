import { z } from 'zod'
import { PubkeySchema, RelayUrlSchema } from '../schemas/common'
import { NostrtEventAddressSchema, NoteIDSchema } from './19'

export const TextNoteTagSchema = z.union([
  z.tuple([
    z.literal('e'),
    NoteIDSchema,
    z.tuple([z.literal(''), RelayUrlSchema]).optional(),
    z.union([
      z.literal('root'),
      z.literal('reply'),
    ]).optional(),
    PubkeySchema.optional(),
  ]),
  z.tuple([
    z.literal('q'),
    z.union([
      NoteIDSchema,
      NostrtEventAddressSchema,
    ]),
    RelayUrlSchema,
    PubkeySchema.optional(),
  ]),
])
