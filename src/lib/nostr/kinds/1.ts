import { kinds } from 'nostr-tools'
import * as z from 'zod'
import { NostrEventSchema } from '../nips/01'
import { TextNoteTagSchema } from '../nips/10'
import { CustomEmojiTagSchema } from '../nips/30'
import { ContentWarningTagSchema } from '../nips/36'
import { createQuery } from '../query-helpers'
import { createTagSchema } from '../schemas/utilities'

export const TextNoteEventSchema = NostrEventSchema.extend({
  kind: z.literal(kinds.ShortTextNote),
  tags: createTagSchema(
    TextNoteTagSchema,
    ContentWarningTagSchema,
    CustomEmojiTagSchema,
  ),
})

export type TextNoteEvent = z.infer<typeof TextNoteEventSchema>

export const [TextNoteQuery, setTextNoteQuery] = createQuery({
  name: 'textnote',
  kind: kinds.ShortTextNote,
  schema: TextNoteEventSchema,
  filterKey: 'ids',
})
