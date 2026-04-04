import * as z from 'zod'
import { PubkeySchema, RelayUrlSchema } from '../schemas/common'
import { tupleWithOptional } from '../schemas/utilities'
import { NostrtEventAddressSchema, NoteIDSchema } from './19'

export const TextNoteTagSchema = z.union([
  tupleWithOptional(
    [
      z.literal('e'),
      NoteIDSchema,
    ],
    z.union([RelayUrlSchema, z.literal('')]),
    z.enum(['root', 'reply']),
    PubkeySchema,
  ),
  tupleWithOptional(
    [
      z.literal('q'),
      z.union([
        NoteIDSchema,
        NostrtEventAddressSchema,
      ]),
      RelayUrlSchema,
    ],
    PubkeySchema,
  ),
])
