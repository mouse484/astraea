import { kinds } from 'nostr-tools'
import { z } from 'zod'
import { NostrEventSchema, TagSchema } from '../nips/01'
import { TextNoteTagSchema } from '../nips/10'
import { ContentWarningTagSchema } from '../nips/36'
import { createQuery } from '../query-helpers'

export const TextNoteEventSchema = NostrEventSchema.extend({
  kind: z.literal(kinds.ShortTextNote),
  tags: z.array(z.union([
    TextNoteTagSchema,
    ContentWarningTagSchema,
    TagSchema,
  ])),
})

export type TextNoteEvent = z.infer<typeof TextNoteEventSchema>

export const TextNoteQuery = createQuery<TextNoteEvent>({
  name: 'textnote',
  kind: kinds.ShortTextNote,
  filterKey: 'ids',
})
