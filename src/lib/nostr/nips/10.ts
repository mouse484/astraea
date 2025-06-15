import { Schema } from 'effect'
import { Tuple } from 'effect/Schema'
import { PubkeySchema, RelayUrlSchema } from '../schemas/common'
import { NostrtEventAddressSchema, NoteIDSchema } from './19'

export const TextNoteTagSchema = Schema.Union(
  Schema.Tuple(
    Schema.Literal('e'),
    NoteIDSchema,
    Schema.optionalElement(Tuple(Schema.Literal(''), RelayUrlSchema)),
    Schema.optionalElement(Schema.Union(
      Schema.Literal('replay'),
      Schema.Literal('root'),
    )).annotations({
      title: 'marker',
    }),
    PubkeySchema,
  ),
  Schema.Tuple(
    Schema.Literal('q'),
    Schema.Union(
      NoteIDSchema,
      NostrtEventAddressSchema,
    ),
    RelayUrlSchema,
    Schema.optionalElement(PubkeySchema),
  ),
)
