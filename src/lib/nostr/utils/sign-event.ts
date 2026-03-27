import type z from 'zod'
import { getUnixTime } from 'date-fns'

export async function signEvent<S extends z.ZodObject<{
  kind: z.ZodNumber | z.ZodLiteral<number>
  tags: z.ZodType<unknown, string[][]>
  content: z.ZodString
}>>(
  schema: S,
  event: Pick<z.output<S>, 'kind' | 'tags' | 'content'>,
) {
  if (!globalThis.nostr || typeof globalThis.nostr.signEvent !== 'function') {
    throw new Error('nostr extension is not available')
  }
  const pickedSchema = schema.pick({ kind: true, tags: true, content: true })
  const encodedEvent = pickedSchema.encode(event)

  return globalThis.nostr.signEvent({
    kind: encodedEvent.kind,
    tags: encodedEvent.tags,
    content: encodedEvent.content,
    created_at: getUnixTime(new Date()),
  })
}
