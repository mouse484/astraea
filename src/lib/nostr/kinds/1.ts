import { Schema } from 'effect'
import { kinds } from 'nostr-tools'
import { NostrEventSchema, TagSchema } from '../nips/01'
import { TextNoteTagSchema } from '../nips/10'
import { createQuery } from '../query-helpers'

export const TextNoteEventSchema = Schema.Struct({
  ...NostrEventSchema.fields,
  kind: Schema.Literal(kinds.ShortTextNote),
  tags: Schema.Array(Schema.Union(...TagSchema.members, ...TextNoteTagSchema.members)),
  content: Schema.String,
})

export const TextNoteQuery = createQuery({
  name: 'textnote',
  schema: TextNoteEventSchema,
  kind: kinds.ShortTextNote,
})
